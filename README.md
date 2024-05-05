# ![Star Badge](https://img.shields.io/static/v1?label=%F0%9F%8C%9F&message=If%20Useful&style=style=flat&color=BC4E99)  [![Website status](https://img.shields.io/website-up-down-green-red/https/f4bccc.vercel.app.svg?label=Website%20status)](https://f4bccc.vercel.app/) Custom RMIT University Assessments Dashboard 

## Usage
 - Download the backend,  <a href="https://github.com/AndiiCodes/canvas-server"> Canvas-Server</a> and host it online.
 - add ``` API_KEY ``` env variable, (  generate an api token from RMIT Canvas profile settings) ,
    - or you can just replace the ```process.env.API_KEY``` on <a href="https://github.com/AndiiCodes/canvas-server"> Canvas-Server</a> with your token directly into the codee ( Not recommended for secuirty purposes.)
  - host the  <a href="https://github.com/AndiiCodes/f4bccc"> Front-End </a> on vercel or gh pages 
  - you might need to change afew things, like class name , favicon if needed.. etc
  - if you need to hide some extra courses for example HOW2RMIT OR any other course, just modify the code below:
```
 courses = courses.filter(
            (course) =>
              course.name !== "Succeed VE 2024" &&
              course.name !== "Dip of Information Technology (2405)"
          ); ```

```
 - you can find above code in <a href="https://github.com/AndiiCodes/f4bccc"> here </a> > public > index.html
