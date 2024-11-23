# Librarium

![image](https://github.com/user-attachments/assets/47ee9772-65f8-47a2-81a2-168da775e225)

## Your own library on the web, a wrapper of libgen.is .
## Try out now at https://librariumm.vercel.app

<br/>

## What it does:

<br/>

- It uses google books api to render a list of books
- The user can choose/search the book using the genre option that they want to read
- By clicking on read now, it will go to the custom api backend which is being run on gitpod (coz I don't have a cool server or something), it goes to libgen.is searches, shows user the options and based on what user chooses, it downloads the book.
- It first tries to go with the IPFS.io url, and if that doesn't work, it tries two times to download using download.library.lol url, and if that doesn't work, it would just return the IPFS.io url.
- The IPFS.io url works in same cases otherwise it will show the cors issue.
- The code for the api backend thingy: https://github.com/0Armaan025/python-pdf-to-image

<br/>

## How to try it locally?

<br/>

### 1.) write the following in the command prompt/terminal/powershell.
### 2.) ``git clone https://github.com/0Armaan025/librarium``
### 3.) ``cd librarium``
### 4.) create a file called ``.env.local`` and get your own keys/tokens and fill the following: 
```
NEXT_PUBLIC_GOOGLE_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```
### 5.) ``npm install`` in your terminal.
### 6.) ``npm run dev`` and there you go! 🔥

## This is just a wrapper for libgen.is 🥹⭐

![how stuff works ig](https://github.com/user-attachments/assets/96492e11-831c-4148-aade-934768ab6a2b)


### Thanks if you are here, also make sure to leave a ⭐, thanks
- Armaan
