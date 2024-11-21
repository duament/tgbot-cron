// SPDX-License-Identifier: MIT

async function forward_message(env, chat_id, from_chat_id, message_id) {
  const url = `https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`
  const data = {
    chat_id,
    from_chat_id,
    message_id,
  }
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
    throw new Error(`send_message: server returns ${response.status} ${response.statusText}`)
  }
}

export default {
  async scheduled(event, env, ctx) {
    await forward_message(env, env.CHAT_ID, env.FROM_CHAT_ID, env.MESSAGE_ID)

    console.log('cron processed')
  },
};
