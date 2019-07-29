import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class NotificationMail {
   get key() {
      return 'NotificationMail';
   }

   async handle({ data }) {
      const { mettup, user } = data;

      await Mail.sendMail({
         to: `${mettup.user.name} <${mettup.user.email}>`,
         subject: 'Novo usuário adicionado ao Evento!',
         template: 'notification',
         context: {
            owner: mettup.user.name,
            event: mettup.titulo,
            desc: mettup.descricao,
            user_u: user.name,
            mail_u: user.email,
            date: format(
               parseISO(mettup.date),
               "'dia' dd 'de' MMM', às' H:mm'h'",
               {
                  locale: pt,
               }
            ),
         },
      });
   }
}

export default new NotificationMail();
