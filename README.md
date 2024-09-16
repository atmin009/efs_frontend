![downloads]( https://img.shields.io/badge/framework-react-blue)
![badge](https://img.shields.io/badge/Language-javascript-green)
![coverage](https://img.shields.io/badge/recommend-after_loading_:_npm_install-brightgreen)
[![YouTube Channel](https://img.shields.io/badge/YouTube-User_Manual-red)](https://www.youtube.com/playlist?list=PL8zWJ_x1KCtxJe8vBrPdKlLfM8yIL_c1s)

# ระบบพยากรณ์การใช้ไฟฟ้า มหาวิทยาลัยวลัยลักษณ์
ระบบพยากรณ์การใช้ไฟฟ้า มหาวิทยาลัยวลัยลักษณ์ ภายใต้การดำเนินโครงงานการพยากรณ์การใช้ไฟฟ้ารายเดือนของหน่วยการศึกษาโดยใช้เทคนิคการทำเหมืองข้อมูล กรณีศึกษา มหาวิทยาลัยวลัยลักษณ์ ซึ่งเป็นหนึ่งในโปรเจคจบของนักศึกษา หลักสูตรเทคโนโลยีสารสนเทศและนวัตกรรมดิจิตัล (เทคโนโลยีอัจฉริยะ ปัจจุบัน) สาขาวิชาเทคโนโลยีสารสนเทศ สำนักวิชาสารสนเทศศาสตร์ มหาวิทยาลัยวลัยลักษณ์ 

## เกี่ยวกับระบบ
  ระบบพยากรณ์การใช้ไฟฟ้าของมหาวิทยาลัยวลัยลักษณ์ถูกพัฒนาขึ้นโดยใช้โมเดลการเรียนรู้ของเครื่องแบบ GradientBoostingRegressor ซึ่งเป็นหนึ่งในเทคนิคที่มีประสิทธิภาพสูงในตระกูลการเรียนรู้แบบเสริมกำลัง (Boosting) กระบวนการทำงานของโมเดลนี้เริ่มจากการสร้างต้นไม้ตัดสินใจต้นแรกเพื่อทำนายค่า จากนั้นจะค่อยๆ เพิ่มโมเดลใหม่ที่เน้นการแก้ไขข้อผิดพลาดของโมเดลก่อนหน้าในแต่ละรอบการเรียนรู้ ทำให้โมเดลสุดท้ายมีความแม่นยำมากขึ้นเรื่อยๆ
  การนำ GradientBoostingRegressor มาใช้ในการพยากรณ์การใช้ไฟฟ้า ทำให้สามารถทำนายการใช้พลังงานได้อย่างมีประสิทธิภาพ แม้ว่าข้อมูลการใช้พลังงานจะมีความผันผวนในแต่ละช่วงเวลา โมเดลนี้สามารถจัดการกับข้อมูลที่มีความซับซ้อนได้ดี ด้วยการค่อยๆ ปรับปรุงโมเดลแต่ละรอบให้แม่นยำยิ่งขึ้นด้วยแนวทางนี้ ระบบสามารถช่วยลดข้อผิดพลาดในการคาดการณ์การใช้ไฟฟ้า สนับสนุนการบริหารจัดการพลังงานให้มีประสิทธิภาพสูงสุดแก่มหาวิทยาลัย

### `FrontEnd`
- React Freamwork
### `Backend`
- Fast API

### `คู่มือการใช้งานระบบ`
- https://www.youtube.com/playlist?list=PL8zWJ_x1KCtxJe8vBrPdKlLfM8yIL_c1s
  
### `พัฒนาระบบโดย`
- ศุภณัฐ ขุนนุ้ย
- ศิขรินทร์ รักษาชาติ
- เกียรติศักดิ์ ศิริเพชร

### `Advisor`
- Aj.จักริน วีแก้ว
  
#### `สาขาเทคโนโลยีสารสนเทศและนวัตกรรมดิจิทัล สำนักวิชาสารสนเทศศาสตร์ มหาวิทยาลัยวลัยลักษณ์`
