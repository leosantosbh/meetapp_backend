import Mettup from '../models/Mett';
import File from '../models/File';
import Banner from '../models/Banner';
import User from '../models/User';

class MyMeetsController {
   async index(req, res) {
      const { page = 1 } = req.query;
      const mettups = await Mettup.findAll({
         where: { user_id: req.userId },
         order: ['date'],
         attributes: ['id', 'titulo', 'descricao', 'local', 'date'],
         limit: 5,
         offset: (page - 1) * 10,
         include: [
            {
               model: Banner,
               as: 'banner',
               attributes: ['id', 'path', 'url'],
            },
            {
               model: User,
               as: 'user',
               attributes: ['id', 'name', 'email'],
               include: [
                  { model: File, as: 'avatar', attributes: ['path', 'url'] },
               ],
            },
         ],
      });

      return res.json(mettups);
   }
}

export default new MyMeetsController();
