import Mett from '../models/Mett';
import Notification from '../schemas/Notification';

class NotificationController {
   async index(req, res) {
      const checkIsNotify = await Mett.findOne({
         where: { user_id: req.userId },
      });

      if (!checkIsNotify) {
         return res.status(401).json({ error: 'Não possui notificações' });
      }

      const notifications = await Notification.find({
         user: req.userId,
         read: false,
      })
         .sort({ createdAt: 'desc' })
         .limit(20);

      return res.json(notifications);
   }

   async update(req, res) {
      const notification = await Notification.findByIdAndUpdate(
         req.params.id,
         { read: true },
         { new: true }
      );

      return res.json(notification);
   }
}

export default new NotificationController();
