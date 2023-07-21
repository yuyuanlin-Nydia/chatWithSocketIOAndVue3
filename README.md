# Chat Project With Vue
前端採用Vue3框架加入Vuex狀態管理、Quasar UI以及typescript型別，<br>
資料庫和後端則分別使用mongoDB和nodejs，<br>
登入登出以token進行驗證，<br>
在聊天室的部分使用socketIO，<br>
參考telegram、line的操作流程，<br>
加入已讀、收回、複製訊息、訊息設為公告等功能。


Live Demo: https://chatwithsocketioandvue3.onrender.com<br>
youTube_螢幕錄影: https://youtu.be/EDy9XfrgObQ<br>

## Features
**使用jsonwebtoken驗證登入登出**<br> 
**聊天室:已讀、收回、複製訊息、訊息設為公告**<br> 

## Screenshot
![Imgur](https://i.imgur.com/71Dvltz.png)
![Imgur](https://i.imgur.com/IQetzpH.png)

## Tools
**前端:Vue3、Typescript、Vuex、Axios、Quasar** <br> 
**後端:socket.io、Express** <br> 
**資料庫:mongoDB** <br> 

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3001`

```bash
yarn serve
```

## Production

Build the application for production:

```bash
yarn build
```
