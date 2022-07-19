import user_config from "../user_config.js";
import My_Fetch from "../tools/My_Fetch.js";
import importHTMLFile from "../tools/importHTMLFile.js";

export default class send_message_class {
   /**
    * 
    * @param {HTMLInputElement} message_input 
    * @param {HTMLDivElement} real_chat 
    * @param {import("../main").default} main_class 
    */
   constructor(message_input, real_chat, main_class) {
      this.message_input = message_input;
      this.real_chat = real_chat;
      this.main_class = main_class;



      this.commands_list = [
         {
            command: "/join ",
            setting_name: "room",
            text: "Pokój został zmieniony na:"
         },
         {
            command: "/color ",
            setting_name: "color",
            text: "Kolor został zmieniony na:"
         },
         {
            command: "/name ",
            setting_name: "name",
            text: "Imię zostało zmienione na:"
         },
         {
            command: "/clear",
         },
         {
            command: "/help",
         }
      ];

      this.init();
   }
   async init() {
      this.help_template = await importHTMLFile("./templates/help.html");
   }
   async send_message() {
      this.mess = this.message_input.value;
      this.message_input.value = "";

      if (this.parsing_message(this.mess)) {

         await My_Fetch.post("./php/send_message.php", {
            message: this.mess,
            ...user_config,
         }, false);

      }

      // eslint-disable-next-line no-undef      
      this.main_class.scrollbar5.update("bottom");

      this.real_chat.scrollTop = this.real_chat.scrollHeight;
   }
   parsing_message(mess) {
      let in_value = mess;

      for (const el of this.commands_list) {
         if (in_value.startsWith(el.command)) {
            if (el.command == "/clear") {
               this.real_chat.innerHTML = "";
            }
            else if (el.command == "/help") {
               let nodes = this.help_template.cloneNode(true);

               nodes.childNodes.forEach(el => {
                  this.real_chat.appendChild(el.cloneNode(true));
               });
            }
            else {

               if (
                  (el.command != "/color "
                     || /^#[0-9A-F]{6}$/i.test(in_value.slice(el.command.length).replace(/\s/g, "")))
                  && user_config[el.setting_name] != in_value.slice(el.command.length).replace(/\s/g, "")
                  && in_value.slice(el.command.length).replace(/\s/g, "") != ""
               ) {

                  user_config[el.setting_name] = in_value.slice(el.command.length).replace(/\s/g, "").substr(0, 20);

                  let info_div = document.createElement("div");
                  info_div.classList.add("info-div", "message-container");
                  info_div.innerText = `${el.text} ${user_config[el.setting_name]}`;

                  this.real_chat.appendChild(info_div);

                  if (el.command == "/join ") {
                     user_config["change_counter"]++;
                     user_config["change_time"] = Date.now();

                     this.main_class.receive_messages_class.receive_messages();
                  }
               }
            }


            return false;
         }
      }

      return true;
   }
}