/**
 * Created by chief on 16/8/22.
 */

define('step',[],function(){
    var data =[{
                "stepType":null,
                "icon":null,
                "stepdata":ko.observableArray([
                    {'title':'Account Info','info':'','infoShow':null,'bgClass':'done'},
                    {'title':'Billing Info','info':'','infoShow':null,'bgClass':'current'},
                    {'title':'Confirmation','info':'','infoShow':null,'bgClass':''}]
                )
        },{
                "stepType":null,
                "icon":true,
                "stepdata":ko.observableArray([
                    {'title':'Account Info','info':'','infoShow':null,'iconClass':'fa fa-user','bgClass':'done'},
                    {'title':'Billing Info','info':'','infoShow':null,'iconClass':'fa fa-shopping-cart','bgClass':'current'},
                    {'title':'Confirmation','info':'','infoShow':null,'iconClass':'fa fa-check','bgClass':''}]
                )
        },{
                "stepType":"true",
                "icon":null,
                "stepdata":ko.observableArray([
                    {'title':'Shopping','infoShow':"true",'info':'Choose what you want','bgClass':'done'},
                    {'title':'Billing','infoShow':"true",'info':'Pay for the bill','bgClass':'current'},
                    {'title':'Getting','infoShow':"true",'info':'Waiting for the goods','bgClass':''}
                ])
        },{
                "stepType":"true",
                "icon":true,
                "stepdata":ko.observableArray([
                    {'title':'Shopping','infoShow':"true",'iconClass':'u-step-icon fa fa-user','info':'Choose what you want','bgClass':'done'},
                    {'title':'Billing','infoShow':"true",'iconClass':'u-step-icon fa fa-shopping-cart','info':'Pay for the bill','bgClass':'current'},
                    {'title':'Getting','infoShow':"true",'iconClass':'u-step-icon fa fa-check','info':'Waiting for the goods','bgClass':''}
                ])
        }];



    var stepModel = function(data) {
      
        this.step = ko.observableArray(data);
        // this.stepdata = ko.observableArray(data.stepdata);
        this.listStyle = ko.observable();
        this.changeStatus = function(style,index){
            console.log(style);
        }.bind(this);
        this.addlist = function(){
            this.listData.push({title: "6. 新添加标题" });
        }.bind(this);
        this.deletelist = function(){
            var listindex = $(event.target).attr("listindex");
            this.listData.splice(listindex,1);
        }.bind(this);
    }


    return new stepModel(data);

});
