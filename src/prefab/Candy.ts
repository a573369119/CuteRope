import GameConfig from "../config/GameConfig";
import Dic from "../Tool/dic";
import Balloon from "../prefab/Balloon";
import RopePoint from "./RopePoint";
import Tool from "../Tool/Tool";

export default class Candy{
    /**横坐标 */
	public candy_X:number;
	/**纵坐标 */
    public candy_Y:number;
    /**糖果 类型 */
    public style : string;
    /**组合刚体 数量 */
    public count : number;
	/**精灵 数组*/
	public arr_Sp:Array<Laya.Sprite>;
	/**刚体 数组*/
    public arr_Body:Array<Laya.RigidBody>;
    /**colider 数组 */
    public arr_Colider:Array<Laya.BoxCollider>;
    /**关节数组 */
    public candy_JointArray:Array<Laya.RevoluteJoint>;
    /**糖果碎片数组 */
    public arr_ApartSp:Array<Laya.Sprite>;
    /**糖果刚体数组 */
    public arr_ApartBody:Array<Laya.RigidBody>;
    /**加入的层 */
    public view : Laya.Panel;   
    /**是否存在泡泡 */
    public isExistBalloon:boolean;
    /**碎糖果记录所在泡泡 */
    public balloonIndex : number;
    /**动画 */
    private aniToOne : Laya.Animation;
    /**记录糖果所在绳子节点 */
    public atRopePoint : number;

    constructor(view){
        this.view = view;
        this.candy_JointArray=new Array<Laya.RevoluteJoint>();
        this.arr_Body = new Array<Laya.RigidBody>();
        this.arr_Colider = new Array<Laya.BoxCollider>();
        this.arr_Sp = new Array<Laya.Sprite>();
        /**---------------糖果碎片------------------ */
        this.arr_ApartSp=new Array<Laya.Sprite>();
        this.arr_ApartBody=new Array<Laya.RigidBody>();
    }

    //初始化,糖果仅有图片的更换  count绳子数量
    init(data,count):void{
        this.isExistBalloon=false;
        this.count = count;
        this.candy_X=data.x;
        this.candy_Y=data.y;
        this.style = data.style;
        this.balloonIndex = -1;
        this.candy_CreateSprite(data.x,data.y,data.style);
        this.candy_AddBody();
        this.candy_AddColider();        
        this.candy_AddCom();
        this.set("nog");

    }
    
    //更新状态
    update(data,count):void{
        this.isExistBalloon=false;
        this.count = count;
        this.candy_X=data.x;
        this.candy_Y=data.y;
        this.balloonIndex = -1;
        this.style=data.style;
        this.candy_CreateSprite(data.x,data.y,data.style);
        this.arr_Sp[0].visible = true;
        this.candy_AddBody();
        this.candy_AddColider();
        this.candy_AddCom();
        this.set("nog");
        
        // console.log(this.arr_Sp);
        // console.log(this.arr_Body);
    }

    //创建糖果精灵
    candy_CreateSprite(x,y,style):void{
        for(let i=0; i<this.count;i++)
        {
            if(!this.arr_Sp[i]) this.arr_Sp[i]=new Laya.Sprite();//不存在 才新创建
            this.arr_Sp[i].loadImage("gameView/" + this.style + ".png");
            //图片区分
            this.arr_Sp[i].zOrder=GameConfig.ZORDER_CANDY;
            this.arr_Sp[i].scaleX = 1;
            this.arr_Sp[i].scaleY = 1;
            this.arr_Sp[i].pivot(this.arr_Sp[i].width/2,this.arr_Sp[i].height/2);
            this.arr_Sp[i].pos(x,y);
            //没有加上舞台i
            if(i!=0) this.arr_Sp[i].visible = false; 
            this.view.addChild(this.arr_Sp[i]);
        }
        //
        // this.mouseJoint();
    }

    //添加RigidBody组件,设置刚体属性
    candy_AddBody():void{   
        let body : Laya.RigidBody;
        for(let i=0;i<this.count; i++)
        {
            body=new Laya.RigidBody();
            body.type="kinematic";
            body.allowSleep = false;
            body.allowRotation = false;
            body.gravityScale = GameConfig.CANDY_GRAVITY;
            body.angularDamping = GameConfig.CANDY_ANGULARDAMPING;
            body.linearDamping = GameConfig.CANDY_LINEARDAMPING;
            this.arr_Sp[i].addComponentIntance(body);
            this.arr_Body.push(body);
        }
    }
    //添加Joint组件,设置关节属性
    candy_AddJoint(body):void{
        for(let i=0;i<this.count;i++)
        {
            if(!this.arr_Sp[i].getComponent(Laya.RevoluteJoint))
            {
                let joint = new Laya.RevoluteJoint();
                joint.otherBody = body;
                joint.anchor = [this.arr_Sp[i].width/2,this.arr_Sp[i].height];
                this.arr_Sp[i].addComponentIntance(joint);
            }
        }

        // let joint = new Laya.RevoluteJoint();
		//     joint.otherBody = body;
		//     joint.anchor = [this.sp.width/2,this.sp.height/2];
        // this.sp.addComponentIntance(joint);
        // this.candy_JointArray.push(joint);
    }

    //添加colider
    candy_AddColider():void{
        let colider = Laya.BoxCollider;
        for(let i=0;i<this.count;i++)
        {
            if(!this.arr_Colider[i]) 
            {
                this.arr_Colider[i] = new Laya.BoxCollider();
                this.arr_Colider[i].width = this.arr_Sp[i].width;
                this.arr_Colider[i].height = this.arr_Sp[i].height;
                this.arr_Colider[i].isSensor=true;
                this.arr_Colider[i].density = GameConfig.CANDY_DENSITY;
                // if(i != 0)
                // {
                //     this.arr_Colider[i].density = 0.0001;
                // }
                this.arr_Sp[i].addComponentIntance(this.arr_Colider[i]);
            }
            // this.arr_Colider[i].density = 1000000;
        }
        this.coliderDensityAverage();
    }

    //**创建结合体 需要“销毁”*/
    candy_AddCom() : void
    {
		let weldJoint : Laya.WeldJoint;
		for(let i=1; i<this.count; i++)
		{
			weldJoint = new Laya.WeldJoint();
			weldJoint.otherBody = this.arr_Body[i-1];
			weldJoint.selfBody = this.arr_Body[i];
			weldJoint.anchor = [this.arr_Sp[i].width/2,this.arr_Sp[i].height/2];
			weldJoint.collideConnected = false;
			this.arr_Sp[i].addComponentIntance(weldJoint);
		}  
    }

    /**刚体密度平均 */
    public coliderDensityAverage() : void
    {
        let number = GameConfig.CANDY_DENSITY/this.arr_Sp.length;
        this.arr_Sp.forEach(sp => {
            if(sp.getComponents(Laya.BoxCollider))
            sp.getComponents(Laya.BoxCollider)[0].density = number;
        });
    }

    /**得到糖果结合体 sprite*/
    public getCandySprite(index) : Laya.Sprite
    {
        let sp = this.arr_Sp[index] ;
        return sp;
    }

    /**得到糖果结合体 body*/
    public getCandyBody(index) : Laya.RigidBody
    {
        let body = this.arr_Body[index] ;
        return body;

    }

    /**给糖果添加mouseJoint */
    private mouseJoint() : void
    {
        let mouseJoint = new Laya.MouseJoint();
        mouseJoint.selfBody = this.arr_Body[0];
        mouseJoint.maxForce = 2000000;
        this.arr_Sp[0].addComponentIntance(mouseJoint);
    }

    /**临时创建结合体 */
    public createBody() : void
    {
        let sp = new Laya.Sprite();
        sp.x = this.arr_Sp[0].x;
        sp.y = this.arr_Sp[0].y;
        sp.width = this.arr_Sp[0].width;
        sp.height = this.arr_Sp[0].height;
        sp.visible = false;
        sp.pivot(sp.width/2,sp.height/2);
        this.arr_Sp.push(sp);
        this.view.addChild(sp);
        //
        let body=new Laya.RigidBody();
        body.type="dynamic";
        body.allowRotation = false;
        body.allowSleep = false;
        body.angularDamping = GameConfig.CANDY_ANGULARDAMPING;
        body.linearDamping = GameConfig.CANDY_LINEARDAMPING;
        sp.addComponentIntance(body);
        this.arr_Body.push(body);
        // //
        // let colider = new Laya.BoxCollider();
        // colider.width = this.arr_Sp[this.arr_Sp.length-1].width;
        // colider.height = this.arr_Sp[this.arr_Sp.length-1].height;
        // colider.isSensor=true;
        // colider.density = GameConfig.CANDY_DENSITY;
        // this.arr_Colider.push(colider);
        // this.arr_Sp[this.arr_Sp.length-1].addComponentIntance(colider);
        // //
        let weldJoint = new Laya.WeldJoint();
        weldJoint.otherBody = this.arr_Body[this.arr_Body.length-2];
        weldJoint.selfBody = this.arr_Body[this.arr_Body.length-1];
        weldJoint.anchor = [this.arr_Sp[this.arr_Sp.length-1].width/2,this.arr_Sp[this.arr_Sp.length-1].height/2];
        weldJoint.collideConnected = false;
        this.arr_Sp[this.arr_Sp.length-1].addComponentIntance(weldJoint);
        console.log(this.arr_Sp.length + " 【糖果刚体数量】 " + this.arr_Colider.length + "【colider数量】" );
        for(let i=0;i<this.arr_Sp.length;i++)
        {
            console.log(this.arr_Sp[i]);
        }
    }


    /**string= nog 表示无重力   string= useg 表示有重力*/
    public set(string) : void
    {
        this.arr_Body.forEach(body=>{
			if(string == "nog")
			{
                body.gravityScale = 0;
			}
			if(string == "useg")
			{
                body.gravityScale = 1;     
                body.type = "dynamic";                         
			}
        });
        ////
    }

    /**糖果合并 动画 */
    public ToOneAnimation() : void
    {
        this.aniToOne = new Laya.Animation();
        let url = [];
        for(let i=0;i<6;i++)
        {
            url.push("gameView/toOne/"+ (i+1) + ".png");
        }
        this.aniToOne.pivot(313/2,298/2);
        this.aniToOne.loadImages(url);
        this.aniToOne.interval = 60;
        this.aniToOne.x = -500;
        this.aniToOne.y = -500;
        this.view.addChild(this.aniToOne);
    }

    public playAni(x,y) : void
    {

        this.aniToOne.x = x;
        this.aniToOne.y = y;
        this.aniToOne.play(0,false);
        this.aniToOne.on(Laya.Event.COMPLETE,this,this.aniOver);
    }

    private aniOver() : void
    {
        this.aniToOne.x = -500;
        this.aniToOne.y = -500;
    }

    /** 糖果 被吃*/
    public candyDestroy(x,y) : void
    {
        let rigidBody;
        console.log(this.arr_Sp);
        this.arr_Sp.forEach(sp => {
            // console.log(sp);
            rigidBody = sp.getComponents(Laya.RigidBody);
            if(rigidBody)
                rigidBody[0].destroy();
            rigidBody = sp.getComponents(Laya.RevoluteJoint);
            if(rigidBody)           
                rigidBody[0].destroy();
        });
        Laya.timer.loop(1,this,this.nearMonster,[x,y]);
    }

    /**糖果断开 */
    public candyDestroyJoint() : void
    {
        let RevoluteJoint;
        console.log(this.arr_Sp);
        this.arr_Sp.forEach(sp => {
            RevoluteJoint = sp.getComponents(Laya.RevoluteJoint);
            if(RevoluteJoint)           
                RevoluteJoint[0].destroy();
        });  
    }

    /**靠近怪物 */
    public nearMonster(x,y) : void
    {
        let dic = Dic.countDic_Object({"x":this.arr_Sp[0].x,"y":this.arr_Sp[0].y},{x,y});
        let addx = 5 * Dic.rotationDeal(this.arr_Sp[0].x,this.arr_Sp[0].y,x,y,"cos");
        let addy = 5 * Dic.rotationDeal(this.arr_Sp[0].x,this.arr_Sp[0].y,x,y,"sin");
        this.arr_Sp.forEach(sp => {
            sp.x += addx;
            sp.y += addy;
            sp.scaleX -= 0.01;
            sp.scaleY -= 0.01;
        });
        if(dic<4)
        {
            this.arr_Sp.forEach(sp => {
                sp.visible = false;
                sp.x = 10000;
            });
        }
    }

    public clearTimer() : void
    {
        Laya.timer.clear(this,this.nearMonster);
        this.arr_Sp.forEach(sp => {
            sp.removeSelf();
            let body = sp.getComponents(Laya.RigidBody);
            let joint = sp.getComponents(Laya.RevoluteJoint);
            let jointW = sp.getComponents(Laya.WeldJoint);
            if(body && body[0]) 
            {
                body[0].destroy();
            }
            if(joint && joint[0])
            {
                joint[0].destroy();
            }
            if(jointW && jointW[0])
            {
                jointW[0].destroy();
            }
        });
        this.arr_Body = [];
        this.candy_JointArray = [];
        this.arr_Sp = [];
        this.arr_Colider = [];
        /**----------------糖果碎片--------- */
        if(this.arr_ApartSp!=[]){
            this.arr_ApartSp.forEach(apartsp=>{
                apartsp.removeSelf();
                let body = apartsp.getComponents(Laya.RigidBody);
                if(body && body[0]) 
                {
                    body[0].destroy();
                }
            });
            this.arr_ApartSp=[];
            this.arr_ApartBody=[];
        }
        
    }



    //初始化糖果碎片
    createCandyApart():void{
        for(let i=0;i<5;i++){
            //精灵
            let sprite=new Laya.Sprite();
                sprite.loadImage("gameView/becomeApart"+(i+1)+".png");
                sprite.pivot(sprite.width/2,sprite.height/2);
                sprite.visible=false;
                sprite.zOrder=3;
                this.view.addChild(sprite);
                this.arr_ApartSp.push(sprite);
            //刚体
            let body=new Laya.RigidBody();
                body.type="static";
                sprite.addComponentIntance(body);
                this.arr_ApartBody.push(body);
        }
    }
    
    //糖果变成碎片
    public becomeApart(x,y):void{
        for(let i=0;i<5;i++){
            this.arr_ApartSp[i].pos(x,y);
            this.arr_ApartSp[i].visible=true;
            this.arr_ApartBody[i].type="dynamic";
            let currX;
            if(Math.random()<0.5){
                currX=Math.random()*(-3);
            }
            else{
                currX=Math.random()*5;
            }
            this.arr_ApartBody[i].setVelocity({x:currX,y:-Math.random()*3-2});
            //销毁糖果
            this.arr_Body.forEach(body => {
                body.destroy();
            });
            this.arr_Sp.forEach(sp =>{
                sp.x = 1000;
            });
            this.arr_Body = [];
        }
    }
    //////////////////////////////超能力调用方法
    public superSetV(vX,vY) : void
    {
        this.arr_Body.forEach(body=>{
            body.setVelocity({x:vX,y:vY});
        });
    }

    /**同步移动方法 */
    public moveTogether() : void
    {
        this.arr_Sp.forEach(sp=>{
            sp.x +=0;
            sp.y +=0;
        });
        if(this.arr_ApartSp)
        {
            this.arr_ApartSp.forEach(sp=>{
                sp.x += 0;
                sp.y += 0;
            })
        }
    }

    /**碎糖果接近 融合 candyOneSp是 arr_sp[0]   sprite*/
    public CandytoOne(candyOneSp) : void
    {///TO DO
        let weldJoint = new Laya.WeldJoint();
        weldJoint.otherBody = candyOneSp.getComponents(Laya.RigidBody)[0];
        weldJoint.selfBody = this.arr_Body[0];
        weldJoint.anchor = [candyOneSp.width/2,candyOneSp.height/2];
        weldJoint.collideConnected = false;
        candyOneSp.loadImage("gameView/candy.png");
        this.arr_Sp[0].pos(candyOneSp.x,candyOneSp.y);
        this.arr_Sp[0].visible = false;
        this.arr_Sp[0].addComponentIntance(weldJoint);
    }

    /**给糖果赋值速度 */
    public setApplyForce(obj1,obj2) : void
    {
        // this.arr_Body[0].applyForce(obj1,obj2);
        for(let i=0;i<this.arr_Sp.length;i++)
        {
            if(this.arr_Sp[i])
            {
                this.arr_Sp[i].getComponents(Laya.RigidBody)[0].applyForce(obj1,obj2);
            }
        }
    }    
    /**给糖果赋值速度 */
    public setApplyV(obj2) : void
    {
        for(let i=0;i<this.arr_Body.length;i++)
        {
            if(this.arr_Body[i])
            this.arr_Body[i].applyLinearImpulseToCenter(obj2);
        }
    }
    /**糖果反向减速 */
    public addApplyV(cos,sin,hookX,hookY) : void
    {
        if(this.arr_Body.length > 0) 
        {
            let obj2 : any = {};
            let totoleV = this.arr_Body[0].linearVelocity.x * cos + this.arr_Body[0].linearVelocity.y * sin;
            if(totoleV < 0) return;
            obj2.x = -totoleV *cos*50;
            obj2.y = -totoleV *sin*50;
            this.arr_Body.forEach(body => {
                body.applyLinearImpulseToCenter(obj2);
            });
        }
    }
////////////////////////////////////绳子伸长缩短
    /**绳子操作 绳子变长变短，实际是糖果的连接节点发生改变  rotateInfo判断方向 rope绳子*/
    public candyChangeRopePoint(rotateInfo,rope) : void
    {
        if(rotateInfo > 0)
        {
            //变短
            //判断是否是可以变化
            if(this.atRopePoint < 5) {this.atRopePoint = 4;return;}
            //找位置
            Laya.timer.loop(1,this,this.foundRopePoint,[rope,this.atRopePoint,--this.atRopePoint]);
            //断开连接
            this.cuteJoint(rope,this.atRopePoint + 1);
            //连接连接
            this.connectJoint(rope,this.atRopePoint);
        }
        else
        {
            //判断是否可以变化
            if(this.atRopePoint > rope.ropePointsArray.length - 1) {this.atRopePoint = rope.ropePointsArray.length-1;return;}
            //找位置
            this.foundRopePoint(rope,this.atRopePoint,++this.atRopePoint);
            //断开连接
            this.cuteJoint(rope,this.atRopePoint - 1);
            //连接连接
            this.connectJoint(rope,this.atRopePoint);
        }
    }

    /**找位置 */
    private foundRopePoint(rope,currentPos,nextPos) : void
    {
        // this.arr_Sp.forEach(sp => {
        //     sp.x = rope.ropePointsArray[nextPos].x;
        //     sp.y = rope.ropePointsArray[nextPos].y;
        // });
        let current : any ={};
        let next : any ={};
        current.x = this.arr_Sp[0].x;
        current.y = this.arr_Sp[0].y;
        next.x = rope.ropePointsArray[nextPos].sp.x;
        next.y = rope.ropePointsArray[nextPos].sp.y;

        let sin = Tool.rotationDeal(current.x,current.y,next.x,next.y,"sin");
        let cos = Tool.rotationDeal(current.x,current.y,next.x,next.y,"cos");
        let dic = Dic.countDic_Object({x:rope.ropePointsArray[currentPos].sp.x,y:rope.ropePointsArray[currentPos].sp.y},{x:next.x,y:next.y});
        let v : any = {};
        v.x = dic * cos /10;
        v.y = dic * sin /10;
        this.setApplyV(v);
        dic = Dic.countDic_Object({x:this.arr_Sp[0].x,y:this.arr_Sp[0].y},{x:next.x,y:next.y});
        if(dic < 3)
        {
            console.log("到了");
            // //连接连接
            Laya.timer.clear(this,this.foundRopePoint);
            this.connectJoint(rope,this.atRopePoint);
        }
    }

    /**断开连接 */
    private cuteJoint(rope,index) : void
    {
        this.candyDestroyJoint();
    }

    /**连接连接 index是需要连接的下标*/
    private connectJoint(rope,index) : void
    {
        let joint = new Laya.RevoluteJoint();
        joint.otherBody = rope.ropePointsArray[index].sp.getComponents(Laya.RigidBody)[0];//获取绳子的body
        for (let i = 0; i < this.arr_Sp.length; i++)  
        {
            let candyJoint = this.arr_Sp[i].getComponents(Laya.RevoluteJoint);
            if (!candyJoint) 
            {
                joint.selfBody = this.getCandyBody(i);//糖果的body
                joint.anchor = [this.getCandySprite(i).width / 2, this.getCandySprite(i).height / 2];
                this.getCandySprite(i).addComponentIntance(joint);
                console.log(this.getCandyBody(i).getBody());
                return ;
            }
        }
        this.createBody();
        index = this.arr_Sp.length - 1;//得到最后一个bmody的下标，也就是最新的
        joint.selfBody = this.getCandyBody(index);
        joint.anchor = [this.getCandySprite(index).width/2,this.getCandySprite(index).height/2];
        this.getCandySprite(index).addComponentIntance(joint);
        this.arr_Body.forEach(body => {
            body.applyForce({x:0,y:0},{x:10000,y:-10});
        });
    }
}