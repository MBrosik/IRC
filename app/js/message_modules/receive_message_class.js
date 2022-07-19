import user_config from "../user_config.js";
import My_Fetch from "../tools/My_Fetch.js";
import parsedDate from "../tools/parsedDate.js";

export default class receive_message_class {
   constructor(real_chat, message_template, scrollbar5) {
      this.real_chat = real_chat;
      this.message_template = message_template;
      this.scrollbar5 = scrollbar5;
   }


   async receive_messages() {
      let pre_count = user_config["change_counter"];
      let pre_room = user_config["room"];

      /**
       * @type {{"id":String,"message":String,"user":String,"color":String,"room":String}[]}
       */
      let data = await My_Fetch.post("./php/receive_messages.php", { ...user_config });

      if (
         pre_count == user_config["change_counter"]
         && pre_room == user_config["room"]
      ) {

         if (data.length != 0) {
            for (const el of data) {
               if (user_config["room"] == el["room"]) {
                  /**@type {HTMLDivElement} */
                  let message_html = this.message_template.cloneNode(true);

                  message_html.querySelector(".time").innerText = parsedDate();
                  message_html.querySelector(".nick").innerText = `<@${el.user}>`;
                  message_html.querySelector(".nick").style.color = el.color;
                  message_html.querySelector(".message").innerText = el.message;

                  var c = el.color.substring(1);      // strip #
                  var rgb = parseInt(c, 16);   // convert rrggbb to decimal
                  var r = (rgb >> 16) & 0xff;  // extract red
                  var g = (rgb >> 8) & 0xff;  // extract green
                  var b = (rgb >> 0) & 0xff;  // extract blue

                  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709                  

                  if (luma < 100) {
                     // pick a different colour
                     message_html.querySelector(".nick").classList.add("shadow-text");

                  }
                  // eslint-disable-next-line no-undef                    
                  $(message_html.querySelector(".message")).emoticonize();

                  this.real_chat.appendChild(message_html);

                  // eslint-disable-next-line no-undef                  
                  this.scrollbar5.update("bottom");

                  this.real_chat.scrollTop = this.real_chat.scrollHeight;

                  user_config["last_id"] = el["id"];
               }
            }
         }
         this.receive_messages();
      }
   }
}