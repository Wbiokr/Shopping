import request from '@/utils/request'

export function upload(fileName,blob) {
  let formData = new FormData(); //這裡連帶form裡的其他參數也一起提交了,如果不需要提交其他參數可以直接FormData無參數的構造函數
  formData.append('file', blob,fileName)
  return request({
    url: '/upload/image',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'  //之前說的以表單傳數據的格式來傳遞fromdata
    },
    data:formData
  })
}

export function uploadUeditor(fileName,blob,_csrf) {
  let formData = new FormData(); //這裡連帶form裡的其他參數也一起提交了,如果不需要提交其他參數可以直接FormData無參數的構造函數
  formData.append('file', blob,fileName)
  return request({
    url: '/ueditor',
    method: 'post',
    params: {
      action: 'uploadimage',
      _csrf,
    },
    headers: {
      'Content-Type': 'multipart/form-data'  //之前說的以表單傳數據的格式來傳遞fromdata
    },
    data:formData
  })
}
