interface API {
  '/v1/attachment' : {
    data: any
  }
}

// function request<T extends keyof API>(url: T, data: API[T]['data']): Promise<API[T]['data']> {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: url,
//       data: data,
//       method: 'POST',
//       success: (res) => {
//         resolve(res.data);
//       },
//       fail: (err) => {
//         reject(err);
//       },
//     });
//   });
// }

export default API;
