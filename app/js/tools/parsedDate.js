export default function parsedDate() {
   let date = new Date();
   let minutes = date.getMinutes();
   minutes = minutes < 10 ? `0${minutes}` : minutes;
   return `[${date.getHours()}:${minutes}]`;
}