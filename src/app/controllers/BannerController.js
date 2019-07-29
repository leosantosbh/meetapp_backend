import Banner from '../models/Banner';

class BannerController {
   async store(req, res) {
      // desestruturar para pegar alguns campos de req.file
      const { originalname: name, filename: path } = req.file;

      const banner = await Banner.create({
         name,
         path,
      });

      return res.json(banner);
   }
}

export default new BannerController();
