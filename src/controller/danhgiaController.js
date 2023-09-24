import DG from '../models/danhgia.js'

 export const getAllDG= async(req,res)=>{
  const makh = req.query.kh||0;
  const sortOrder = req.query.sortOrder || 'asc';
  let query={};
  if (makh!==0){
    query.makh=makh
  }
  console.log(query);
    try{
      let listDG= await DG.find(query);
      if (sortOrder === 'asc') { 
        listDG = await DG.find(query).sort({ createdAt: 'asc' });
      } else {
        listDG = await DG.find(query).sort({ createdAt: 'desc' });
      }
        res.send(listDG);
    }catch(e){
        res.status(500).send(e)
    }
    
}
export const createDanhGia = async (req, res) => {
    try {
      const newDG = await DG.create(req.body);
      res.json(newDG);
    } catch (e) {
        res.status(500).send(e)
    }
  };
export  const updateDanhGia = async (req, res) => {
    const { id } = req.params;
    try {
      const updatedDG = await DG.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if(!updatedDG)
       {
        return res.status(404).send("Not found");
       }
       else{
        res.json(updatedDG);
       }
      
    } catch (e) {
        res.status(500).send(e)
    }
  };


  export  const deleteDanhGia = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedDG = await DG.findByIdAndDelete(id);
      if(!deletedDG)
       {
        return res.status(404).send("Not found");
       }
       else{
        res.send("delete success!");
       }
      //res.json(deletedDG);
    } catch (e) {
        res.status(500).send(e)
    }
  };


  /*export const getDGBySP= async(req,res)=>{
    try{
        const { id } = req.params;
        const perPage = req.query.perPage || 10; // Lấy số sản phẩm trên một trang từ request query (mặc định là 10)
        const page = req.query.page || 0; // Lấy số trang từ request query (mặc định là 0)
        const sortOrder = req.query.sortOrder || 'asc';

        let listDG= await DG.find({masp:id}) 
        .limit(perPage) // Giới hạn số lượng sản phẩm trên một trang
        .skip(perPage * page); // Bỏ qua số lượng sản phẩm trên các trang trước đó
  
        if(listDG.length==0)
       {
        return res.status(404).send("Not found");
       }
       else{
        if (sortOrder === 'asc') { // Sắp xếp tăng dần nếu sortOrder là 'asc'
            listDG = listDG.sort({ createdAt: 'asc' });
          } else { // Sắp xếp giảm dần nếu sortOrder là 'desc'
            listDG = listDG.sort({ createdAt: 'desc' });
          }
      
          //listDG = await listDG.exec();
        const totalDG = await DG.countDocuments({masp:id});
        res.status(200).json({
            totalDG:totalDG,
            pages: Math.ceil(totalDG / perPage),
            listDanhGia:listDG
        })
       }
        
    }catch(e){
        res.status(500).send(e)
    }
    
}*/

export const getDGBySP = async (req, res) => {
    try {
      const { id } = req.params;
      const perPage = req.query.perPage || 10; // Lấy số sản phẩm trên một trang từ request query (mặc định là 10)
      const page = req.query.page || 0; // Lấy số trang từ request query (mặc định là 0)
      const sortOrder = req.query.sortOrder || 'asc';
      const rating = parseInt(req.query.rating);

      let query={masp:id};
      if (rating) {
        query.rating = rating; 
      console.log(query);}
  
      let listDG = await DG.find({ masp: id })
        .limit(perPage) // Giới hạn số lượng sản phẩm trên một trang
        .skip(perPage * page); // Bỏ qua số lượng sản phẩm trên các trang trước đó
  
      if (listDG.length === 0) {
        return res.status(404).json({ error: 'Not found' });
      } else {
        if (sortOrder === 'asc') { // Sắp xếp tăng dần nếu sortOrder là 'asc'
          listDG = await DG.find(query).sort({ createdAt: 'asc' });
        } else { // Sắp xếp giảm dần nếu sortOrder là 'desc'
          listDG = await DG.find(query).sort({ createdAt: 'desc' });
        }
  
        const totalDG = await DG.countDocuments(query);
        res.status(200).json({
          totalDG: totalDG,
          pages: Math.ceil(totalDG / perPage),
          listDanhGia: listDG,
        });
      }
    } catch (e) {
      res.status(500).send(e);
    }
  };

