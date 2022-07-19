/**
 * 
 * @param {*} src 
 * @returns {Promise<HTMLDivElement>}
 */
export default async function importHTMLFile(src) {
   const response = await fetch(src);
   const html = await response.text();

   // @ts-ignore
   return new DOMParser().parseFromString(html, "text/html").body.querySelector("div");
}