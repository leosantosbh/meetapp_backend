import { Op } from 'sequelize';
import { isBefore } from 'date-fns';
import User from '../models/User';
import Mettup from '../models/Mett';
import File from '../models/File';
import Banner from '../models/Banner';
import Agend from '../models/Agend';
import Notification from '../schemas/Notification';

// import NotificationMail from '../jobs/NotificationMail';
// import Queue from '../../lib/Queue';

class AgendController {
   async index(req, res) {
      const { page = 1 } = req.query;

      const agend = await Agend.findAll({
         where: { user_id: req.userId },
         limit: 5,
         offset: (page - 1) * 5,
         include: [
            {
               model: Mettup,
               as: 'mett',
               where: {
                  date: {
                     [Op.gt]: new Date(),
                  },
               },
               attributes: ['titulo', 'descricao', 'local', 'date'],
               include: [
                  {
                     model: User,
                     as: 'user',
                     attributes: ['name', 'email'],
                  },
                  { model: Banner, as: 'banner', attributes: ['path', 'url'] },
               ],
            },
            {
               model: User,
               as: 'user_invited',
               attributes: ['name', 'email'],
               include: [
                  { model: File, as: 'avatar', attributes: ['path', 'url'] },
               ],
            },
         ],
         order: [['mett', 'date']],
      });

      return res.json(agend);
   }

   async store(req, res) {
      const user = await User.findByPk(req.userId, {
         attributes: ['id', 'name', 'email'],
      });

      const mettup = await Mettup.findByPk(req.params.id, {
         attributes: ['id', 'date', 'user_id', 'titulo', 'descricao'],
         include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      });

      const agend = await Agend.findOne({
         where: { user_id: user.id, mett_id: req.params.id },
      });

      const checkDate = await Agend.findOne({
         where: { user_id: user.id },
         include: [
            {
               model: Mettup,
               as: 'mett',
               required: true,
               where: {
                  date: mettup.date,
               },
            },
         ],
      });

      if (user.id === mettup.user_id) {
         return res.status(400).json({ error: 'Usuário já é organizador' });
      }

      if (isBefore(mettup.date, new Date())) {
         return res.status(400).json({ error: 'Evento já ocorreu' });
      }

      if (agend) {
         return res.status(400).json({ error: 'Já inscrito no evento' });
      }

      if (checkDate) {
         return res.status(400).json({ error: 'Existe conflito de horário' });
      }

      // notificar prestador
      await Notification.create({
         content: `${user.name} entrou no meetup ${mettup.titulo}`,
         user: mettup.user_id,
      });

      // return res.json({ mettup, user });

      const subscribe = await Agend.create({
         user_id: user.id,
         mett_id: mettup.id,
      });

      // await Queue.add(NotificationMail.key, {
      //   mettup,
      //   user,
      // });

      // desestruturar para pegar alguns campos de req.fil
      return res.json(subscribe);
   }
}

export default new AgendController();
