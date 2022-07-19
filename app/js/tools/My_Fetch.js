export default class My_Fetch {
   /**
    * 
    * @param {RequestInfo} url     
    * @returns {Object}
    */
   static async get(url) {
      return await fetch(url).then(res => res.json());
   }
   /**
    * 
    * @param {RequestInfo} url 
    * @param {Object} data 
    * @returns {Object}
    */
   static async post(url, data, bool = true) {
      let post_f = await fetch(url, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data)
      });

      if (bool) {
         return await post_f.json();
      }
   }
}