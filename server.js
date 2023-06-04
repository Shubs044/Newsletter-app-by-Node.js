const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require('https');
const Secretapi=require('dotenv').config()
const app=express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstname=req.body.fname;
    const secondname=req.body.lname;
    const email=req.body.email;

    console.log(firstname,secondname,email);

    const data={
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                FNAME: firstname,
                LNAME: secondname
                }
            }
        ]
    };

    const JSONdata=JSON.stringify(data);

    const url="https://us21.api.mailchimp.com/3.0/lists/3376dfe229";

    const api=process.env.API_KEY

    const options = {
        method: "POST", 
        auth: "shubs:b718a52307f1d0903460cec4f0172326-us21"
    }


    const request=https.request(url,options,function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/sucess.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    })
    request.write(JSONdata);
    request.end();

});


app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Started");
});
