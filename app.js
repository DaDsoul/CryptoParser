 const request = require('request')
 var firebase = require('firebase')
const express = require('express')
const cheerio = require('cheerio')
var dateFormat = require('dateformat')

const app = express()

firebase.initializeApp({
	serviceAccount: "./Tsepochka-125959916519.json",
	databaseURL:"https://tsepochka-backend.firebaseio.com/"
})

var counterCrypto = -1 

var sites = [
        {name:"https://profitmaker.today/",
        main: ".okno_4_l_div_a",
        title:".okno_4_l_div_a_r_p",
        text:'.okno_4_l_div_a_r_span',
        href:"",
        data:'.okno_4_l_div_a_r_div_span_1',
        source: 'profitmaker'
      },
      {name:"http://newscryptocoin.com/category/",
        main: '.post',
        title:".news-title",
        text:'p',
        href:'a',
        data:'span.news-date',
        source: 'newscryptocoin'
      },
      {name: "http://forklog.com/tag/",
       main:".item",
       title:"span",
       text:"span",
       href:"a",
       data:".article_date",
       source:"forklog"
      },
	  {name:"https://coinmarket.news/",
	   main:".post-summary.psum-horizontal.post-format-standard.mas-item.clearfix",
       title: ".post-title",
	   text: ".post-excerpt",
	   href: "a",
	   data: ".post-meta.clearfix.no-sep",
	   source:"coinmarket"	
	  }
]



var categories = [
   	{
		name: "ICO",
		profitmaker: "ico",
		newscryptocoin: "ico",
		forklog: "ico",
	  	coinmarket: "ico"
   	},
   	{
		name: "Биткойн",
		profitmaker: "",
		newscryptocoin: "",
		forklog: "",
	  	coinmarket: "bitcoin"
   	},
   	{
		name: "Эфир",
		profitmaker: "",
		newscryptocoin: "ethereum",
		forklog: "ethereum",
	  	coinmarket: "ethereum"
   	},
   	{
		name: "Технологии",
		profitmaker: "",
		newscryptocoin: "bitcoin-technology",
		forklog: "",
	  	coinmarket: "blockchain"
   	},
   	{
		name: "Биржи",
		profitmaker: "crypto/exchange/",
		newscryptocoin: "trading-bitcoin/exchanges",
		forklog: "",
	  	coinmarket: ""
	},
	{
		name: "Криптокошельки",
		profitmaker: "crypto/cryptowallet",
		newscryptocoin: "",
		forklog: "",
	  	coinmarket: ""
	},
	{
		name: "Познавательные статьи",
		profitmaker: "crypto/poznavatelnie-statyi",
		newscryptocoin: "articles",
		forklog: "",
		coinmarket: ""
	},
	{
		name: "Мнения",
		profitmaker: "",
		newscryptocoin: "",
		forklog: "mnenie",
	  	coinmarket: ""
	},
	{
		name: "Банки",
		profitmaker: "",
		newscryptocoin: "economy",
		forklog: "",
	  	coinmarket: ""
	},
	{
		name: "Регулирования",
		profitmaker: "",
		newscryptocoin: "",
		forklog: "regulirovanie",
	  	coinmarket: ""
	},
	{
		name: "Хардфорк",
		profitmaker: "",
		newscryptocoin: "",
		forklog: "hardfork",
	  	coinmarket: "altcoin"
	},
	{
		name: "Китайский привет",
		profitmaker: "",
		newscryptocoin: "",
		forklog: "kitaj",
	  	coinmarket: ""
	},
	{
		name: "Майнинг",
		profitmaker: "",
		newscryptocoin: "",
		forklog: "",
	  coinmarket: "majning"
	}
]
  
 

app.all("/stata", (req,res) => {
  request.get("http://coincap.io/front",(err,respo,body) => {
      JSON.parse(body,(key,value) =>{
        if (counterCrypto < 50) {
          switch (key){
            case "long":
              if (value){
                counterCrypto++
                firebase.database().ref().child("NewStatistics").child(counterCrypto).child("name").set(value)
                
                value = value.toLowerCase()
                value = value.replace(" ","-")
                var valueLowerCase = value.toLowerCase
                firebase.database().ref().child("NewStatistics").child(counterCrypto).child("picture").set("https://coincap.io/images/coins/" +  valueLowerCase + ".png")

              } 
              break 
            case "price":
             if (value){
                firebase.database().ref().child("NewStatistics").child(counterCrypto).child("price").set(value)
            }
              break
            case "mktcap":
             if (value){
                //var element = parseFloat(value)
                firebase.database().ref().child("NewStatistics").child(counterCrypto).child("market").set(value)
             } 
              break
            case "short":
              if (value){
                  firebase.database().ref().child("NewStatistics").child(counterCrypto).child(key).set(value)
        
              }
              break
           
            default:
          }
        }
        
       firebase.database().ref().child("NewStatistics").child("50").remove()

      })
  })


var result = []

var months = ["January", "February", "March", "April", "May", "June", "August", "September", "October", "July", "November", "December"]//["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var monthsRussianLowercase = ["январь", "февраль", "март", "апрель", "май", "июнь", "август", "сентябрь", "октябрь", "июль", "ноябрь", "декабрь"]
var monthsRussianUppercase = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Август", "Сентябрь", "Октябрь", "Июль", "Ноябрь", "Декабрь"]
var monthsRussianLowercCase = ["января", "февраля", "марта", "апреля", "мая", "июня", "августа", "сентября", "октября", "июля", "ноября", "декабря"]
var trueMonthes = [" January,", " February,", " March,", " April,", " May,", " June,", " July,", " August,", " September,", " October,", " November,", " December,"]//["January", "February", "March", "April", "May", "June", "August", "September", "October", "July", "November", "December"]
var numberMonthes = [".01",".02",".03",".04",".05",".06",".07",".08",".09",".10",".11",".12"]

var counter = 0

categories.forEach((catVal, catIndex) => {
	var lastIndex = 1


sites.forEach((value, i) => {
if (catVal[value.source] != "") {
  request.get(value.name + catVal[value.source], (err,resp,body) => {
  
  try{
    const $ = cheerio.load(body)

    let els = $(value.main)

    els.each((index,el) => {
     let element = {}
      
    element.source = value.source

     img = $(el).find('img').first().attr("src")

      if (img){
        if (img.includes('ht') == false){
          element.img = img.insert(0, "https://profitmaker.today")
        } else{
         element.img = img        }
        } else {
          element.img = ""
         }

    if (element.source != "forklog"){

      element.title = $(el).find(value.title).first().text()
       .replace('    ','')
       .replace('            ','')
       .replace('\nперевод\n\n\n\n\n\n\n\n\n','')
       .replace('\n\n\n\n\n\n\n\n\n    ','')
       .replace('','')
       .replace('\n\t\t\t','')
       .replace('\n\t\t','')
       .replace('\n                ','')
       .replace('\n            ','')
       .replace('\n','')
       .replace('\n','')
       .replace('\n','')
       .replace('\n','')


      element.text = $(el).find(value.text).first().text()
      .replace('\n\t\t\t','')
      .replace('\n\t\t','')
      .replace('\n                ','')
      .replace('\n            ','')
      .replace('\n')
      .replace('undefined\n','')
      .replace('\n','')
      .replace('\n','')
      .replace('\n','')
	  .replace('undefined','')

     } else {
      
      element.text = $(el).find(value.title).find("p:nth-child(2)").text()
       .replace('    ','')
       .replace('            ','')
       .replace('\nперевод\n\n\n\n\n\n\n\n\n','')
       .replace('\n\n\n\n\n\n\n\n\n    ','')
       .replace('','')
       .replace('\n\t\t\t','')
       .replace('\n\t\t','')
       .replace('\n                ','')
       .replace('\n            ','')
       .replace('\n','')
       .replace('\n','')
       .replace('\n','')
       .replace('\n','')

       element.title =  $(el).find(value.title).first().text()
       .replace('    ','')
       .replace('            ','')
       .replace('\nперевод\n\n\n\n\n\n\n\n\n','')
       .replace('\n\n\n\n\n\n\n\n\n    ','')
       .replace('','')
       .replace('\n\t\t\t','')
       .replace('\n\t\t','')
       .replace('\n                ','')
       .replace('\n            ','')
       .replace('\n','')
       .replace('\n','')
       .replace('\n','')
       .replace('\n','')
       .replace(element.text,'')


     }

    href = $(el).find(value.href).first().attr('href')
    href2 =  $(el).first().attr('href')

    if (href){
       if (href.includes('http://') == false){
          element.href = href.insert(0, "https://russian.rt.com")
       } else {
         element.href = href
       }
    } else {
      element.href = $(el).first().attr('href')
    }

    if (element.source == "forklog" || element.source == "coinmarket"){

        element.href = element.href.replace('https://russian.rt.com','')
    }

    var date = $(el).find(value.data).first().text()
      .replace('\n\t\t\t\t','')
  		.replace('\n\t\t\t','')
      .replace('\n\t\t','')
      .replace('\n\t','')
      .replace(',','')
  		.replace(monthsRussianLowercase[0],months[0])
  		.replace(monthsRussianLowercase[1],months[1])
  		.replace(monthsRussianLowercase[2],months[2])
  		.replace(monthsRussianLowercase[3],months[3])
  		.replace(monthsRussianLowercase[4],months[4])
  		.replace(monthsRussianLowercase[5],months[5])
      .replace(monthsRussianLowercase[6],months[6])
  		.replace(monthsRussianLowercase[7],months[7])
  		.replace(monthsRussianLowercase[8],months[8])
  		.replace(monthsRussianLowercase[9],months[9])
  		.replace(monthsRussianLowercase[10],months[10])
  		.replace(monthsRussianLowercase[11],months[11])
      .replace(monthsRussianUppercase[0],months[0])
  		.replace(monthsRussianUppercase[1],months[1])
  		.replace(monthsRussianUppercase[2],months[2])
  		.replace(monthsRussianUppercase[3],months[3])
  		.replace(monthsRussianUppercase[4],months[4])
  		.replace(monthsRussianUppercase[5],months[5])
      .replace(monthsRussianUppercase[6],months[6])
  		.replace(monthsRussianUppercase[7],months[7])
  		.replace(monthsRussianUppercase[8],months[8])
  		.replace(monthsRussianUppercase[9],months[9])
  		.replace(monthsRussianUppercase[10],months[10])
  		.replace(monthsRussianUppercase[11],months[11])
      .replace(monthsRussianLowercCase[0],months[0])
      .replace(monthsRussianLowercCase[1],months[1])
      .replace(monthsRussianLowercCase[2],months[2])
      .replace(monthsRussianLowercCase[3],months[3])
      .replace(monthsRussianLowercCase[4],months[4])
      .replace(monthsRussianLowercCase[5],months[5])
      .replace(monthsRussianLowercCase[6],months[6])
      .replace(monthsRussianLowercCase[7],months[7])
      .replace(monthsRussianLowercCase[8],months[8])
      .replace(monthsRussianLowercCase[9],months[9])
      .replace(monthsRussianLowercCase[10],months[10])
      .replace(monthsRussianLowercCase[11],months[11])
      .replace(numberMonthes[0],trueMonthes[0])
      .replace(numberMonthes[1],trueMonthes[1])
      .replace(numberMonthes[2],trueMonthes[2])
      .replace(numberMonthes[3],trueMonthes[3])
      .replace(numberMonthes[4],trueMonthes[4])
      .replace(numberMonthes[5],trueMonthes[5])
      .replace(numberMonthes[6],trueMonthes[6])
      .replace(numberMonthes[7],trueMonthes[7])
      .replace(numberMonthes[8],trueMonthes[8])
      .replace(numberMonthes[9],trueMonthes[9])
      .replace(numberMonthes[10],trueMonthes[10])
      .replace(numberMonthes[11],trueMonthes[11])
      .replace(numberMonthes[12],trueMonthes[12])
      .replace(".","")
   

      let dater = require('date-and-time')
      var now = new Date(date)
      dater.locale('en')
      var nowDate = dater.format(now, 'MMMM D, YYYY')//, hh:mm A')


      element.data = nowDate.replace('a.m.','AM').replace('p.m.','PM')

      request.get(element.href, (e,r,b) => {

        if (element.source == "profitmaker"){

         const $ = cheerio.load(b)

         var els = $(".short_story-text").text()

         var els3 = " "
        
         var els2 = $("div.full-story-content").find("div[style]")
        
        els2.each((i,value) => {

          var element = {}

          element.paragraph = $(value).find("span").text()


          if (i == els2.length - 1){

              els3 += element.paragraph

          } else {

              els3 += element.paragraph + "\n\n"

          }

        })

        var fullStoryContent = $("div.full-story-content").html()

        // var htmlCode = cheerio.load(fullStoryContent,{decodeEntities: false})

         element.textTitle = els
         element.textHref = els3//resultText
         
         // element.html = htmlCode.html()
        
        }else if (element.source == "newscryptocoin" ){

           const $ = cheerio.load(b)

           var els4 = ''

           var someNumber = 1

           var oneMoreNumber = 0

           var els = $(".postcol").find("div[id]").find("p")

          var elsHtml = $(".postcol").find("div[id]").html()

          // var htmlCode = cheerio.load(elsHtml,{decodeEntities: false})

            els.each((index,value) => {

              var element = {}

              element.paragraph = $(value).text()

              someNumber ++
            
              var els5 = $(".postcol").find("div[id]").find('h2:nth-child(' + someNumber + ')')

              //console.log(someNumber)

              element.header = els5.text()

              if (element.header){
                  //console.log(element.header)
            
                  element.header.fontcolor("red")

                  els4 += element.paragraph + "\n\n\n" + element.header + "\n\n "

                  someNumber ++


              } else {

                  els4 += element.paragraph + "\n\n"
                  
              }
              

              
            })        
        
           element.textHref = els4.replace('Имя (обязательно)',' ').replace('Почта (обязательно)','').replace('Сайт','').replace('Уведомить меня о новых комментариях по email.','').replace('Уведомлять меня о новых записях почтой.','')

           // element.html = htmlCode.html()

      }else if (element.source == "coinmarket"){

          const $ = cheerio.load(b)
          var elspar = ""

          var els = $(".post-content").find("p")
          
          els.each((i,value) => {
              elspar += $(value).text() + '\n'
          })
          element.textHref = elspar


      } 
      
      else if (element.source == "forklog"){
          try{
          const $ = cheerio.load(b)
          var elspar = ""
          var els = $("section[id]").find("p")
          els.each((i,value) => {
            elspar += $(value).text() + '\n'
              })
          element.textHref = elspar
          }catch(e){
            console.log("Forklog_Problems")
          }
          
      }
	   
	  
		  firebase.database().ref().child('news').child(catVal.name).child(lastIndex).set(element)
		  lastIndex = lastIndex + 1
		  if (element.source == "forklog"){
		  }
     })
          
    })

  }catch(e){
    console.log("Booom!!!")
  }

  })
}
})


})

})

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length)
  else
    return string + this
}