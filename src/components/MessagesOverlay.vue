<template>
  <!-- <messages-overlay v-for="chat in unreadConversations" v-bind:ref="'chat'+chat.id"></messages-overlay> -->
  <div
    :id="'messages-'+instance"
    class="messages-overlay-container"
    :class="{'open': open}"
  >
    <div
      class="conversation-title pb-1 pt-2"
      :class="{'unread': unread}"
    >
      <span
        class="subject"
        @click="toggleThreadOpen(threadId)"
      >{{ subject }}</span>
      <!-- <span class="participants text-trucate">
        <a :href="conversation.url" v-for="participant in conversation.participants" v-bind:key="participant.user_id" class="participant">
          {{ participant.name.trim() }}
        </a>
      </span> -->
      <div
        class="close-btn pr-0 mr-0"
        @click="closeThread(threadId)"
      >
        &times;
      </div>
      <div
        class="minimize-btn"
        @click="toggleThreadOpen(threadId)"
      >
        {{ !open ? '+' : '–' }}
      </div>
    </div>
    <div class="conversation-body">
      <div class="messages py-2">
        <div
          v-for="msg in computedMessages"
          :key="msg.message_id"
          class="msg"
        >
          <div :class="[msg.user_id !== user.id ? 'incoming_msg' : 'outgoing_msg']">
            <div
              v-if="msg.user_id !== user.id"
              class="incoming_msg_img"
            >
              <img
                :src="'https://artistrepublik.com/profile/'+msg.user_id+'/avatar.png'"
                alt="sunil"
                loading="lazy"
              >
            </div>
            <div :class="[msg.user_id !== user.id ? 'received_msg' : 'sent_msg']">
              <div
                v-if="msg.user_id !== user.id"
                class="received_withd_msg"
              >
                <p>{{ msg.body }}</p><br>
                <span class="time_date mt-0 mb-2">{{ formatTime(msg.updated_at) }}   |    {{ formatDate(msg.updated_at) }}</span>
              </div>
              <p v-if="msg.user_id === user.id">
                {{ msg.body }}
              </p><br v-if="msg.user_id==user.id">
              <span
                v-if="msg.user_id === user.id"
                class="time_date mt-0 mb-2"
              >{{ formatTime(msg.updated_at) }}   |    {{ formatDate(msg.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="send-message container-fluid">
      <div class="row m-0 p-0">
        <input
          v-model="newMessage"
          type="text"
          class="col py-0 m-0 px-2 message-input write_msg"
          placeholder="Type your message..."
          @keyup.enter="postMessage"
        >
        <v-btn
          class="w-auto send-message-btn"
          dark
          @click="postMessage"
        >
          Send
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style type="text/css">
.messages-overlay-container {
  width: 160px;
  background-color: white;
  /* position: fixed; */
  /* bottom: 0; */
  /* right: 50px; */
  z-index: 99999;
  /* border-width: 2px 2px 0;
  border-style: solid;
  border-color: #212529; */
  font-size: 0.875em;
  transition: all 0.6s;
}

.messages-overlay-container.open {
  width: 270px;
}

.conversation-title .subject {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  max-width: 66%;
}

.messages-overlay-container .conversation-body,
.messages-overlay-container .send-message {
  height: 0;
  transition: 0.6s all;
}

.messages-overlay-container.open .conversation-body {
  height: 259px;
}

.messages-overlay-container.open .send-message {
  height: 30px;
}

.messages {
  height: 100%;
  padding: 0 1rem;
  overflow: auto;
  width: 100%;
}

.show {
  display: inline-block !important;
}

.conversation-title {
  line-height: 0.875rem;
  padding: 0.25rem 1rem 0;
  background-color: #212529;
  color: white;
}

.conversation-title.unread {
  background-color: #05728f;
}

.conversation-title a.participant {
  color: white;
}

.subject {
  cursor: pointer;
}

.conversation-title a.participant:hover {

}

.participants {
  display: inline-block;
  max-width: 60%;
  overflow: hidden;
  white-space: nowrap;
  line-height: 1.125rem;
}

a.participant:not(:last-child)::after {
  content: ", ";
  margin-left: -0.2rem;
}

.minimize-btn, .close-btn {
  float: right;
  font-size: 1.125rem;
  padding: 0 0.25rem;
  cursor: pointer;
  /* line-height: 0.875em; */
}

.send-message {
  text-align: center;
  /* padding: 0 1rem; */
  /* border-top: 1px solid #212529; */
}

.send-message input {
  /* width: calc(100% - 44.72px); */
  /* line-height: 26px; */
  padding-left: 0.5rem;
  font-size: 0.875rem;
  border-width: 0;
}

.send-message-btn {
  background-color: #05728f;
  border-width: 0;
  color: white;
  line-height: 30px;
  font-size: 0.875rem;
}

img {
  max-width: 100%;
}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}

.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}

.sent_msg span, .received_withd_msg span {
  white-space: nowrap;
}

.sent_msg {
  text-align: right;
}

.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  display: inline-block;
}

.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}

.messages-overlay-container .received_withd_msg {
  width: unset !important;
  max-width: 80% !important;
}

.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 60%;
}

.sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  display: inline-block;
}

.messages-overlay-container .outgoing_msg {
  overflow: hidden;
  margin-bottom: 1rem 0;
}

.messages-overlay-container .sent_msg {
  float: right;
  width: unset !important;
  max-width: 80% !important;
}

.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}

.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}

.messaging {
  padding: 0 0 50px 0;
}

.msg_history {
  height: 516px;
  overflow-y: auto;
}
</style>

<script type="application/javascript">
// need method to scroll to bottom, triggered on load and after message send / reload
// props only include x most recent messages
// method to load more messages when scrolled to top

export default {
  props: {
    instance: Number,
    threadId: Number,
    subject: String,
    closeThread: Function,
    open: Boolean,
    toggleThreadOpen: Function,
    unread: Boolean,
    messages: Array,
    user: {
      type: Object,
      default: function () {
        return {
          id: localStorage.getItem('user_id'),
          name: 'Jamison'
        }
      },
      description: 'Current user'
    }
  },
  data () {
    return {
      newMessage: ''
      // participantUsers: []    // user objects from participants, including avatar url
      // messages: {},
      // hideConversation: false,
      // localMessages: JSON.parse(JSON.stringify(this.messages))
    }
  },
  computed: {
    computedMessages () {
      return this.messages
    }
  },
  created () {
    // this.participantUsers = async () => {
    //   return this.participants.map(p=>await this.$store.dispatch('getUser', p.user_id);
    // }
    // setTimeout(function(){
    //   const parent = document.querySelector('#messages-'+this.instance);
    //   const messagesWindow = parent.querySelector('.messages');
    //   messagesWindow.scrollTop = messagesWindow.scrollHeight;
    // }, 500);
    // this.getOverlayMessages();
    // this.getThread(this.threadId);
  },
  updated () {
    // setTimeout(function(){
    //   const parent = document.querySelector('#messages-'+this.instance);
    //   const messagesWindow = parent.querySelector('.messages');
    //   messagesWindow.scrollTop = messagesWindow.scrollHeight;
    // }, 500);
  },
  methods: {
    // closeConversation(e) {
    //   e.target.parentElement.parentElement.remove();
    // },
    // getThread: async function(id) {
    //   this.messagesPage = 1;

    //    // friends and participants stuff
    //   // this.filteredFriends = JSON.parse(JSON.stringify(this.friends));
    //   // this.participantArray = JSON.parse(
    //   //   JSON.stringify(
    //   //     this.thread.participants.filter(p => parseInt(p.user_id) !== parseInt(this.user.id))
    //   //   )
    //   // );
    //   // // console.log(this.participantArray);
    //   // this.participantArray.forEach(p=>
    //   //   p.name = this.friends.find(f=>
    //   //     f.id===p['user_id']).name
    //   // );
    // 	// this.filteredFriends.forEach(f=>{
    // 	// 	let match = this.participantArray.find(x=>x['user_id']===f.id);
    // 	// 	if (match) this.filteredFriends.removeFromArray
    //   // })


    // 	await this.getMessages(this.messagesPage);
    // 	this.threads.filter(
    //     thread => thread.conversation.id === id
    //   )[0].unread = false;
    //   // this.recipientId = -1;
    //   this.recipients = {};
    // },
    // getMessages: async function(page) {
    //   await this.$store.dispatch("fetchThread", {
    //     threadId: this.thread.conversation.id,
    //     page,
    //     overlay: false
    //   });
    //   const messages = this.$store.getters.getMessages;
    //   this.messages = messages.map(m => {
    //     return { ...m, body: this.formatHyperlinks(m.body) };
    //   });
    //   setTimeout(function(){
    //     const msgHistory = document.getElementsByClassName('msg_history')[0];
    //     msgHistory.scrollTop = msgHistory.scrollHeight;
    //   }, 500);
    // },
    postMessage: async function () {
      if (this.newMessage.length === 0) return
      // if (this.recipientId >= 0) {   // if creating a new thread
      //   if (this.newThreadSubject.length === 0) return;
      //   // what recipient object does MessagingController@store need?
      //   // this.$store.dispatch('createThread', { recipient: [this.recipientId], subject: this.newThreadSubject, message: this.newMessage });
      //   this.postThread();
      // } else {
      const createdMessage = await this.$store.dispatch('sendMessage', {
        message: this.newMessage,
        threadId: this.threadId
      })
      this.newMessage = ''
      const that = this
      setTimeout(function () {
        const mw = document.querySelector(`#messages-${that.instance} .messages`)
        mw.scrollTop = mw.scrollHeight
      }, 500)
      this.$emit('newmessage', createdMessage)
    },


    // postMessage: async function() {
    //   // convert urls to hyperlinks, wherever we want this
    //   let linkIndex = this.newMessage.indexOf('http');
    //   while (linkIndex !== -1) {
    //     let a = this.newMessage.indexOf('http');
    //     let b = this.newMessage.slice(this.newMessage.indexOf('http')).indexOf(' ');
    //     let url = this.newMessage.slice(a, b)
    //     let link = "<a href='" + url + "'>" + url + "</a>";
    //     this.newMessage = this.newMessage.slice(0, a) + link + this.newMessage.slice(a+b);
    //     linkIndex = this.newMessage.indexOf('http', linkIndex+1);
    //   }
    //   // const url = '';
    //   // const user_id = 1234 //user.id || null;
    //   // const headers = {'Content-Type': 'application/json'};
    //   // const message = this.newMessage;
    //   // const created_time = Date.now();
    //   // const body = JSON.Stringify({body: message, created_time, user_id});
    //   // await fetch(url + user_id, {method: 'POST', headers, mode: 'same-origin', body})
    //   //   .then(res => res.data)
    //   //   .then(data => {
    //   //     this.messages.push(data.message);
    //   //     this.message="";
    //   //   })
    //   //   .catch(err => err);
    //   if (this.newMessage.length === 0) return;
    //   this.localMessages.push({message_id: this.messages[this.messages.length-1].message_id + 1, user_id: this.user.id, body: this.newMessage, created_time: Date.now()});
    //   this.newMessage = "";
    // },
    formatTime (date) {
      date = new Date(date)
      let hours = date.getHours()
      let minutes = date.getMinutes()
      const amPm = hours >= 12 ? 'PM' : 'AM'
      hours = hours > 12 ? hours - 12 : hours
      if (hours === 0) hours = 1
      minutes = minutes < 10 ? '0' + minutes : minutes
      return `${hours}:${minutes} ${amPm}`
    },
    formatDate (date) {
      date = new Date(date)
      const today = new Date(Date.now())
      const yesterday = new Date(today.getTime() - 1000 * 60 * 60 * 24)
      if (today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()) {
        return 'Today'
      } else if (yesterday.getDate() === date.getDate() &&
        yesterday.getMonth() === date.getMonth() &&
        yesterday.getFullYear() === date.getFullYear()) {
        return 'Yesterday'
      }
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const month = months[date.getMonth()]
      let day = date.getDate()
      return `${month} ${day}`
    }
  }
  // , created: function() {
  // document.querySelector('')
  // }
}
</script>
