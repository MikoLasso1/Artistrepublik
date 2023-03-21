<template>
  <div class="messaging-overlay-container d-flex justify-content-around align-items-end">
    <div
      v-for="(t, index) in computedActiveThreads"
      :key="index"
      class="messages-container mr-2 shadow"
    >
      <messages-overlay
        v-if="t.render"
        :thread-id="t.id"
        :subject="t.subject"
        :instance="index"
        :open="t.open"
        :toggle-thread-open="toggleThreadOpen"
        :close-thread="closeThread"
        :messages="t.messages"
        :unread="t.unread"
        @newmessage="handleNewMessage"
      />
    </div>

    <div :class="[ 'threads-overlay-container', 'shadow', computedShowThreadsList ? 'show' : '' ]">
      <div
        class="show-threads-list-toggle bg-light py-1 px-3"
        @click="showThreadsList = !showThreadsList"
      >
        Messages <span
        v-if="!computedShowThreadsList && computedUnreadThreadIds.length > 0"
        class="badge bg-warning text-light"
      >{{ computedUnreadThreadIds.length }}</span>
      </div>

      <div class="threads-list bg-dark text-left px-0 container">
        <div
          v-for="(t, index) in computedThreads"
          :key="index"
          class="thread text-light row pt-2 mx-0 px-2 pb-1"
          :class="{'unread': computedUnreadThreadIds.includes(t.conversation.id)}"
          @click="openThread(t.conversation.id)"
        >
          <div class="col-9 m-0 p-0">
            <!-- <img :src="t" alt="" class="thread-recipient-thumb"> -->
            <div class="subject">
              {{ t.conversation.subject }}
            </div>
            <div class="latest-message-summary text-muted">
              {{ t.latest_message.body }}
            </div>
          </div>
          <div class="latest-message-time col-3 text-right m-0 p-0 text-muted">
            {{ formatConversationTime(t.latest_message.created_at) }}
          </div>
        </div>
      </div>
      <div
        v-if="computedShowThreadsList"
        class="thread-previous-next container-fluid bg-dark"
      >
        <v-btn
          dark
          class="col-6 text-center btn text-light"
          :disabled="page===1"
          @click="newThreadsPage(false)"
        >
          &lt;
        </v-btn>
        <v-btn
          dark
          class="col-6 text-center btn text-light"
          :disabled="threads.length < 5"
          @click="newThreadsPage(true)"
        >
          &gt;
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style type="text/css">
.messaging-overlay-container {
  position: fixed;
  bottom: 0;
  right: 2em;
}

.threads-overlay-container {
  /* position: fixed;
  bottom: 0;
  right: 2em; */
  display: inline-block;
  z-index: 99999;
  text-align: center;
  width: 10em;
  transition: 0.6s all;
}

.threads-overlay-container.show {
  width: 16em;
}

.threads-list {
  height: 0;
  width: 100%;
  overflow: hidden;
  transition: 0.6s all;
}

.threads-overlay-container.show .threads-list {
  overflow: auto;
  height: 16.5625em;
}

.show-threads-list-toggle {
  /* width: 100px; */
  /* background: white; */
  font-size: 0.875rem;
  cursor: pointer;
}

.show-threads-list-toggle span {
}

.show-threads-list-toggle.show {
  width: 100%;
  /* width: 200px; */
}

.thread {
  cursor: pointer;
  font-size: 0.875em;
  border-top: 1px solid #393939;
  border-bottom: 1px solid #444;
}

.thread.unread {
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
}

.thread .subject {
  /* line-height: 6em; */
  white-space: nowrap;
  overflow: hidden;
}

.thread .latest-message-summary {
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.75rem;
}

.thread .latest-message-time {
  font-size: 0.75rem;
  /* line-height: 0.875rem; */
}
</style>

<script type="application/javascript">
/*import MessagesOverlay from "./MessagesOverlay";
var threadsRefresh;
export default {
  props: {
  },
  data() {
    return {
      threads: [],
      unreadThreadIds: [],
      activeThreads: [],        // {id, open}
      page: 1,
      showThreadsList: false
    }
  },
  methods: {
    async getThreads() {
      await this.$store.dispatch('fetchThreads', {page: this.page, overlay: true, auto: false});
      this.threads = this.$store.getters.getOverlayThreads.map(t=>{return {...t, render: true}});
      this.threads = this.threads.sort((a,b) => new Date(a.conversation.updated_at) < new Date(b.conversation.updated_at) ? 1 : 0);
      console.log(this.threads);
      this.markUnreadThreads();
    },
    markUnreadThreads() {
      for (let i=0; i<this.threads.length; i++) {
        if (this.threads[i]['latest_message']['user_id'] === localStorage.getItem('user_id')) continue;            // if latest message from you, skip
        let participant = this.threads[i].participants.find(p=>p['user_id']===localStorage.getItem('user_id'));    // find you
        if (participant === undefined) continue;
        let lastReadDate = new Date(participant['last_read']);                                                     // find your last_read
        let latestMessageDate = new Date(this.threads[i]['latest_message']['created_at']);                         // find thread's latest message
        if (lastReadDate < latestMessageDate) this.threads[i].unread = true;                                       // compare & mark thread unread
      }
    },
    newThreadsPage(next) {
      next ?
        this.page++
        :
        this.page--
      this.getThreads();
      clearInterval(threadsRefresh);
      var interval = Object.entries(this.thread).length > 0 ? 5000 : 10000;
      threadsRefresh = setInterval(this.refresh, interval);
    },
    async openThread(id) {
      var i = this.activeThreads.findIndex(t=>t.id===id);
      console.log(i);
      if (i === -1) {
        console.log('i is -1')
        const subject = this.threads.find(t=>t.conversation.id===id).conversation.subject;
        const thread = {id, open: false};
        this.activeThreads.unshift({...thread, subject, render: true});
        if (this.activeThreads.length > 4) this.activeThreads.pop();
        i = this.activeThreads.findIndex(t=>t.id===id);
        await this.getOverlayMessages(id);
      }
        // this.activeThreads.find = id;
      this.activeThreads[i].open = !this.activeThreads[i].open;
      if (this.threads.find(t=>t.conversation.id===id).hasOwnProperty('unread'))
        this.threads.find(t=>t.conversation.id===id).unread = false;
      this.$nextTick();
    },
    closeThread(id) {
      const i = this.activeThreads.findIndex(t=>t.id===id);
      this.activeThreads = [...this.activeThreads.slice(0,i), ...this.activeThreads.slice(i+1)];
      this.$nextTick();
    },
    toggleThreadOpen(id) {
      const thread = this.activeThreads.find(a=>a.id===id);
      thread.open = !thread.open;
    },
    async getOverlayMessages(threadId, page = 1) {
      // var m;
      var thread = this.activeThreads.find(at=>at.id===threadId);
      await this.$store.dispatch('fetchThread', {threadId, page, overlay: true})
        .then(t=>thread.messages = t.messages);
      // thread.messages = m;
    },
    // async updateNewMessage(threadId, message) {
    //   this.threads.find(t=>t.conversation.id===threadId).messages.push(message);
    // },
    handleNewMessage(message) {
      const thread = this.activeThreads.find(t=>t.id===message.thread_id);
      thread.messages = [...thread.messages, message];

      console.log('newMessage', message, 'updated thread.messages', thread.messages);
      this.forceRefresh(message.thread_id);
      // setTimeout(function() {
      //   this.nextTick().then(function(){
      //
      // }, 300);
    },
    formatTime(date) {
      date = new Date(date);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const amPm = hours >= 12 ? "PM" : "AM";
      hours = hours > 12 ? hours - 12 : hours;
      if (hours === 0) hours = 1;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes}${amPm}`;
    },
    formatDate(date) {
      date = new Date(date);
      const today = new Date(Date.now());
      const yesterday = new Date(today.getTime() - 1000*60*60*24);
      if (today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()) {
        // return "Today";
        return "";
      } else if (yesterday.getDate() === date.getDate() &&
        yesterday.getMonth() === date.getMonth() &&
        yesterday.getFullYear() === date.getFullYear()) {
        return "Yesterday";
      }
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const month = months[date.getMonth()];
      let day = date.getDate();
      return `${month} ${day}`;
    },
    formatConversationTime(date) {
      // return date;
      date = new Date(date);
      var fDate = this.formatDate(date);
      if (fDate === "Today") return this.formatTime(date);
      if (fDate === "Yesterday") return fDate;
      return date.getMonth()+1 + "/" + date.getDate();
    },
    formatHyperlinks(message) {
      // convert urls to hyperlinks, wherever we want this
      let linkIndex = message.indexOf("http");
      let a, b, url, rem, link, end;
      while (linkIndex > -1) {
        a = message.indexOf("http", linkIndex);
        b = message.slice(a).search(/([\s,()'"]|[\.!?]+$|[\.!?&,]{2,})/); // remove parentheses from matching?
        url = message.substring(a, b > 0 ? a + b : message.length);
        rem = message.slice(b);
        link = "<a href='" + url + "'>" + url + "</a>";
        end = b < 0 ? "" : message.slice(a + b);
        message = message.slice(0, a) + link + end;
        linkIndex = message.indexOf("http", a + link.length);
      }
      return message;
    },
    forceRefresh(id) {
      this.activeThreads.find(t=>t.id===id).render = false;
      this.$nextTick(() => {
        this.activeThreads.find(t=>t.id===id).render = true;
      });
    },
    refresh() {
      this.$store.dispatch('fetchThreads', {page: this.page, overlay: true, auto: true}).then(()=>{
        this.threads = this.$store.getters.getOverlayThreads.map(t=>{return {...t, render: true}});
        this.unreadThreadIds = this.$store.getters.getUnreadThreadIds;
        console.log('getunreadthreadids', this.$store.getters.getUnreadThreadIds)
      });

      for (let i = 0; i < this.activeThreads.length; i++)
        this.getOverlayMessages(this.activeThreads[i].id);

      console.log('refresh');
    }
  },
  created() {
      // this.getThreads();
      localStorage.setItem('token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFiODcxNjQzMzIwNzc1YTEwYzk3MjY1ZDNiYmZmMzNjYjY3MzU0MjkzMzg4OWUzYTZmNTI4NmZlM2U2ZWY3ZTRiZTYyMjYzNWYxNzM4MjA1In0.eyJhdWQiOiI3IiwianRpIjoiYWI4NzE2NDMzMjA3NzVhMTBjOTcyNjVkM2JiZmYzM2NiNjczNTQyOTMzODg5ZTNhNmY1Mjg2ZmUzZTZlZjdlNGJlNjIyNjM1ZjE3MzgyMDUiLCJpYXQiOjE1NzcxNDYyMTAsIm5iZiI6MTU3NzE0NjIxMCwiZXhwIjoxNjA4NzY4NjEwLCJzdWIiOiIzIiwic2NvcGVzIjpbXX0.Cmi2JfyuxsgSH4SV48CC3UwqRpK2Mkk-XDaRwpn0uHcqq0Go2l2F8URqUnTqhsgCLXvsc6hn7yLkVrSi78xSXanflQqEQn_8MFU5BXnugiI5JYO686zW68A3g1_bErEU7FyrBwm6AAWxnvSR8HInVHclgmR-ccSBGj2fZj5zQ9CCfSiBuT31gWFSi3NbssAKVTzA3V9eiU0jpY1UX7Uh964ANLGVFQrV-X4rV1WF5oO97MXUrK6AcWCBB93p7VehHtTCRGn6f-nu4yKDn99dre7-Hbsl0bobKRQtZpIqMgaB1bT2pH22lPXaDjvunCx7y7PkDL6v6SfWfer9pHViEAWSQi7Bsg5aE4FximzkkN0hjOSq_rdS57f4XWMb4GdwUKB_A7PdFYMs0BLSPjj72zJJjKUzqzi1MmI6lUkf-nnJGPwe0RzJvKYvwVSSF-ZKwANv1Fx9hY7wHWyxuBrQKumQouDgPQCfyXk5UqakhTFn5pcziuYUXcRLGSfoMz6QR5qr17tWpigLizWftxS4Nwuz6_T67HWT-wle2_d-BrydwXJ5gg5USBRvCwal3L3JBXtZ5nJ8iDPVTR1PYNe9p-KAVAhTeoGNbujRyWmcxnD0rBKDDK98qjKv9alIqVziAeq71Vg9FAPkPga4YM5mD9_5bF_ygsGknmhuyjGbAjs");
      localStorage.setItem('user_id', 3);
      this.getThreads();
      threadsRefresh = setInterval(this.refresh, 5000);
      this.unreadThreadIds = this.$store.getters.getUnreadThreadIds;
  },
  computed: {
    computedThreads() {
      if (this.threads.length === 0) return null;
      return this.threads;
      // .map(t=>{
      //   if (this.unreadThreadIds.includes(t.conversation.id)) t.unread = true;
      // });
    },
    computedActiveThreads() {
      return this.activeThreads;
    },
    computedOpenThreadId() {
      return this.openThreadId;
    },
    computedShowThreadsList() {
      return this.showThreadsList;
    },
    computedMessages(threadId) {
      // var thread = this.activeThreads.find(t=>t.id===threadId);
      // if (!thread.hasOwnProperty(messages))
        return null;
      // return thread.messages;
    },
    computedUnreadThreadIds() {
      // if (this.unreadThreadIds === undefined) return [];
      return this.unreadThreadIds;
    }
  },
  beforeDestroy() {
    clearInterval(threadsRefresh);
  },
  updated() {
    let interval = this.showThreadsList && this.activeThreads.filter(t=>t.open).length > 0 ? 5000 : 10000;
    clearInterval(threadsRefresh);
    threadsRefresh = setInterval(this.refresh, interval);
  }
  ,components: {
    'messages-overlay': MessagesOverlay
  }
}*/
</script>
