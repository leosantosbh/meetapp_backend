import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Mettup from '../models/Mett';
import File from '../models/File';
import Banner from '../models/Banner';
import User from '../models/User';

class MettControle {
   async index(req, res) {
      const { page = 1, meet } = req.query;
      if (meet) {
         const mettups = await Mettup.findByPk(meet, {
            order: ['date'],
            attributes: ['id', 'titulo', 'descricao', 'local', 'date'],
            limit: 5,
            offset: (page - 1) * 5,
            include: [
               {
                  model: Banner,
                  as: 'banners',
                  attributes: ['id', 'path', 'url'],
               },
               {
                  model: User,
                  as: 'users',
                  attributes: ['id', 'name', 'email'],
                  include: [
                     { model: File, as: 'avatar', attributes: ['path', 'url'] },
                  ],
               },
            ],
         });

         return res.json(mettups);
      }

      const mettups = await Mettup.findAll({
         order: ['date'],
         attributes: ['id', 'titulo', 'descricao', 'local', 'date'],
         limit: 10,
         offset: (page - 1) * 10,
         include: [
            {
               model: Banner,
               as: 'banners',
               attributes: ['id', 'path', 'url'],
            },
            {
               model: User,
               as: 'users',
               attributes: ['id', 'name', 'email'],
               include: [
                  { model: File, as: 'avatar', attributes: ['path', 'url'] },
               ],
            },
         ],
      });

      return res.json(mettups);
   }

   async store(req, res) {
      const schema = Yup.object().shape({
         titulo: Yup.string().required(),
         descricao: Yup.string().required(),
         local: Yup.string().required(),
         date: Yup.date().required(),
         banner_id: Yup.number().required(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      if (isBefore(parseISO(req.body.date), new Date())) {
         return res.status(400).json({ error: 'Date not permited' });
      }

      const user_id = req.userId;

      const mettup = await Mettup.create({
         ...req.body,
         user_id,
      });

      return res.json(mettup);
   }

   async delete(req, res) {
      const user_id = req.userId;

      const mettup = await Mettup.findByPk(req.params.id);

      if (!mettup) {
         return res.status(400).json({ error: 'Evento já removido.' });
      }

      if (mettup.user_id !== user_id) {
         return res.status(400).json({ error: 'Não Autorizado' });
      }

      if (isBefore(mettup.date, new Date())) {
         return res
            .status(400)
            .json({ error: 'Não é possível deletar evento passado.' });
      }

      await mettup.destroy();

      return res.send();
   }

   async update(req, res) {
      const schema = Yup.object().shape({
         title: Yup.string(),
         file_id: Yup.number(),
         description: Yup.string(),
         location: Yup.string(),
         date: Yup.date(),
      });

      if (!(await schema.isValid(req.body))) {
         return res.status(400).json({ error: 'Validation fails' });
      }

      const user_id = req.userId;

      const mettup = await Mettup.findByPk(req.params.id);

      if (!mettup) {
         return res.status(400).json({ error: 'Evento já removido.' });
      }

      if (mettup.user_id !== user_id) {
         return res.status(400).json({ error: 'Não Autorizado' });
      }

      if (isBefore(mettup.date, new Date())) {
         return res
            .status(400)
            .json({ error: 'Não é possível editar evento passado.' });
      }

      await mettup.update(req.body);

      return res.json(mettup);
   }
}

export default new MettControle();
