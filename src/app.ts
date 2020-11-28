import chalk from 'chalk'
import 'dotenv-defaults/config'

import { createMailer } from './services/mailer'
import { getState, saveGiftsToState } from './services/state'
import { getEmailTargets } from './services/emailTargets'
import { generateGifts } from './services/gifts'

const main = async (): Promise<void> => {
  if (process.env.DEBUG) {
    console.log(
      chalk.bold(chalk.red('App started in debug mode!')),
      "No email will be sent, and generated Needy won't be saved to DB"
    )
  }

  if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
    throw new Error('Please enter Gmail credentials into env file!')
  }

  const state = await getState()
  const generatedGifts = await generateGifts(state)

  console.log(generatedGifts)

  await saveGiftsToState(state, generatedGifts)
  if (process.env.DEBUG) return

  const mailer = createMailer(process.env.MAIL_USERNAME, process.env.MAIL_PASSWORD)
  mailer.sendMail({
    from: `DrawTheNeedyApp <${process.env.MAIL_USERNAME}>`,
    to: await getEmailTargets(),
    subject: `🥳 ${'$NAME'} is a Needy of the following week!`,
    content: `
      <h1>Greetings fellow friend!</h1>
      <p>🥳 &nbsp;<b>${'$NAME'}</b> is a Needy of the following week!</p>
      <p>See ya next time!</p>
      <hr />
      <small>This email was sent to you, because Jan Tobolewski added your email to this notification, contact him if you don't want to hear about it</small>
      `,
  })
  console.log(chalk.blue('Emails were sent!'))
}

const handleError = (error: Error) => {
  console.log(chalk.red('An error occured!'))
  console.log(process.env.DEBUG ? error.stack : error.message)
}

main().catch(handleError)
