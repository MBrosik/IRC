import user_config from "./user_config.js";
import importHTMLFile from "./tools/importHTMLFile.js";
import getRandomColor from "./tools/getRandomColor.js";
import send_message_class from "./message_modules/send_message_class.js";
import receive_message_class from "./message_modules/receive_message_class.js";

class app {
   constructor() {
      // this.real_chat = document.getElementById("real-chat viewport");
      this.real_chat = document.querySelector("#real-chat .viewport .overview");
      this.message_el = {
         /**@type {HTMLInputElement} */
         input: document.getElementById("message-input"),
         button: document.getElementById("enter-message")
      };

      // eslint-disable-next-line no-unused-vars, no-undef
      this.real_chat_1 = $("#real-chat");

      this.real_chat_1.tinyscrollbar();
      // eslint-disable-next-line no-unused-vars, no-undef
      this.scrollbar5 = this.real_chat_1.data("plugin_tinyscrollbar");
      console.log(this.scrollbar5);
      // eslint-disable-next-line no-undef
      this.scrollbar5.update(Math.max(0, $(".overview").offsetHeight - $(".overview").offsetHeight + 20));


      this.init();
   }
   async init() {
      this.message_template = await importHTMLFile("./templates/message.html");

      this.send_message_class = new send_message_class(this.message_el.input, this.real_chat, this);
      this.receive_messages_class = new receive_message_class(this.real_chat, this.message_template, this.scrollbar5);

      this.set_user_config();
      this.setListeners();
      this.receive_messages_class.receive_messages();
   }

   async set_user_config() {
      let pre_name = prompt("Podaj imię");
      if (pre_name != null && pre_name != "") {
         user_config.name = pre_name;
      }
      user_config.color = getRandomColor();
   }


   setListeners() {

      this.message_el.button.onclick = () => {
         this.send_message_class.send_message();
      };
      window.onkeypress = (e) => {
         if (e.code == "Enter") {
            this.send_message_class.send_message();
         }
      };
   }
}

export default app;




window.onload = () => {
   new app();

   document.getElementById("color_span").innerHTML = document.getElementById("color_input").value;
   document.getElementById("color_input").oninput = (e) => {
      document.getElementById("color_span").innerHTML = e.currentTarget.value;
   };
};