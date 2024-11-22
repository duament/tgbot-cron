// SPDX-License-Identifier: MIT

async function post_tg_bot_api(token, method, data) {
  const url = `https://api.telegram.org/bot${token}/${method}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
  console.log(data)
  if (!response.ok) {
    throw new Error(`${method}: server returns ${response.status} ${response.statusText}`)
  }
}

async function send_message(token, chat_id, text) {
  const data = {
    chat_id,
    text,
  }
  await post_tg_bot_api(token, 'sendMessage', data)
}

async function forward_message(token, chat_id, from_chat_id, message_id) {
  const data = {
    chat_id,
    from_chat_id,
    message_id,
  }
  await post_tg_bot_api(token, 'forwardMessage', data)
}

export default {
  async scheduled(event, env) {
    switch (event.cron) {
      case "0 3,8 * * *":
        await forward_message(env.TG_BOT_TOKEN, env.CHAT_ID, env.FROM_CHAT_ID, env.MESSAGE_ID)
        break;
      case "30 0-16/2 * * *":
        await send_message(env.TG_BOT_TOKEN, env.CHAT_ID, env.MESSAGE0)
        break;
      default:
        console.log(`unknown cron: ${event.cron}`)
    }

    console.log('cron processed')
  },

  async fetch(req, env) {
    const data = await req.json()
    if (data.token === env.TG_BOT_TOKEN) {
      await forward_message(env, env.CHAT_ID, env.FROM_CHAT_ID, env.MESSAGE_ID)
      return new Response()
    } else {
      return new Response('Bad token')
    }
  },
};
