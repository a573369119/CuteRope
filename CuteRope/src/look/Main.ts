import GameConfig from "./GameConfig";
import Hook from "./Hook";
import Rope from "./Rope";
import Candy from "./Candy";
class Main {
	private arrays:Array<any>=new Array<any>();
	private candy:Candy;
	private rope1:Rope;
	private rope2:Rope;
	private rope3:Rope;
	constructor() {
		Laya.init(750,1334,Laya.WebGL);
		Laya.loader.load("res/atlas/comp.atlas",Laya.Handler.create(this,this.onLoaded),
		null,Laya.Loader.ATLAS);
	}

	onLoaded():void{
		console.log("成功");
		this.init();
	}

	init():void{
		Laya.Physics.enable({allowSleeping:true,gravity:12});
		// Laya.PhysicsDebugDraw.enable();
		this.initWorld();
		Laya.timer.loop(1500,this,function(){console.log(this.candy.getCandy(0).x + " ,"  +this.candy.getCandy(0).y)});
	}

	initWorld():void{
		let hook1=new Hook(350,200);
		let hook2=new Hook(150,200);
		let hook3=new Hook(600,200);
		this.candy = new Candy(222,258,3);
		this.rope1=new Rope(25,hook1.x,hook1.y,350,500);
		this.rope2=new Rope(8,hook2.x,hook2.y,150,300);
		this.rope3=new Rope(50,hook3.x,hook3.y,600,800);
		var joint=new Laya.MouseJoint();
		this.candy.getCandy(0).addComponentIntance(joint);
		this.candy.set("nog");
		Laya.timer.loop(10,this,this.go);
		
		// var joint2=new Laya.RopeJoint();
		// joint2.selfBody=this.candy.body;
		// joint2.otherBody=this.rope1.ropePointsArray[0].body;
		// joint2.selfAnchor=this.candy.anchor;
		// joint2.otherAnchor=this.rope1.ropePointsArray[0].anchor;
		// joint2.maxLength=Math.sqrt(Math.pow(360 - 200,2) + Math.pow(440 - 200,2));
		// this.candy.candy.addComponentIntance(joint2);
		// this.contactCandy();
		/*let hook2=new Hook(400,200);
		joint.maxForce=1000;
		this.rope1=new Rope(40,hook2.x,hook2.y,this.candy.x,this.candy.y);*/
		// this.contactCandy();
		// this.contactCandy_2();
	}	
	go() : void
	{
			// this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.x = this.candy.x;
			// this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].rp.x = this.candy.x;
			
			// this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].rp.y = this.candy.y;
			// this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.y = this.candy.y;
			let object1:any = {};
			object1.x = 10 * this.rotationDeal(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.x,this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.y,this.candy.getCandy(0).x,this.candy.getCandy(0).y,"cos");
			object1.y = 10 * this.rotationDeal(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.x,this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.y,this.candy.getCandy(0).x,this.candy.getCandy(0).y,"sin");
			this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].body.setVelocity(object1);
			let object2 :any= {};
			object2.x = 10 * this.rotationDeal(this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].rp.x,this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].rp.y,this.candy.getCandy(0).x,this.candy.getCandy(0).y,"cos");;
			object2.y = 10 *  this.rotationDeal(this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].rp.x,this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].rp.y,this.candy.getCandy(0).x,this.candy.getCandy(0).y,"sin");;
			this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].body.setVelocity(object2);
			let object3 :any= {};
			object3.x = 10 * this.rotationDeal(this.rope3.ropePointsArray[this.rope3.ropePointsArray.length-1].rp.x,this.rope3.ropePointsArray[this.rope3.ropePointsArray.length-1].rp.y,this.candy.getCandy(0).x,this.candy.getCandy(0).y,"cos");;
			object3.y = 10 *  this.rotationDeal(this.rope3.ropePointsArray[this.rope3.ropePointsArray.length-1].rp.x,this.rope3.ropePointsArray[this.rope3.ropePointsArray.length-1].rp.y,this.candy.getCandy(0).x,this.candy.getCandy(0).y,"sin");;
			this.rope3.ropePointsArray[this.rope3.ropePointsArray.length-1].body.setVelocity(object3);

			// console.log(Math.sqrt(Math.pow(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.x - this.candy.candy.x,2) + Math.pow(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.y - this.candy.candy.y,2)) < 5);
			if(Math.sqrt(Math.pow(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.x - this.candy.getCandy(0).x,2) + Math.pow(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].rp.y - this.candy.getCandy(0).y,2)) < 5 && Math.sqrt(Math.pow(this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].rp.x - this.candy.getCandy(0).x,2) + Math.pow(this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].rp.y - this.candy.getCandy(0).y,2)) < 5 && Math.sqrt(Math.pow(this.rope3.ropePointsArray[this.rope3.ropePointsArray.length-1].rp.x - this.candy.getCandy(0).x,2) + Math.pow(this.rope3.ropePointsArray[this.rope3.ropePointsArray.length-1].rp.y - this.candy.getCandy(0).y,2)) < 5 )
			{
				Laya.timer.clear(this,this.go);
				this.contactCandy();
				this.candy.set("useg");
				// this.contactCandy_2();
				// this.contactCandy_3();
				
			}			
	}
	contactCandy():void{
		// this.rope1.createJoint(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].body,this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].anchor,
		// 	this.candy.body,this.candy.anchor,this.candy.candy);
			/*this.rope2.createJoint(this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].body,this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].anchor,
				this.candy.body,this.candy.anchor,this.candy.candy);*/
				let joint = new Laya.RevoluteJoint();
				let point = this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1];
				joint.otherBody = point.rp.getComponent(Laya.RigidBody);
				joint.selfBody = this.candy.getBody(0);
				joint.anchor = [this.candy.getCandy(0).width/2,this.candy.getCandy(0).height/2];
				this.candy.getCandy(0).addComponentIntance(joint);
		// Laya.timer.loop(1,this,function(){this.candy.candy.x =250; this.candy.candy.y =300});
	}
	contactCandy_2():void{
		// this.rope1.createJoint(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].body,this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].anchor,
		// 	this.candy.body,this.candy.anchor,this.candy.candy);
			/*this.rope2.createJoint(this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].body,this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].anchor,
				this.candy.body,this.candy.anchor,this.candy.candy);*/
				let joint = new Laya.RevoluteJoint();
				let point = this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1];
				joint.otherBody = point.rp.getComponent(Laya.RigidBody);
				joint.selfBody = this.candy.getBody(1);
				joint.anchor = [this.candy.getCandy(1).width/2,this.candy.getCandy(1).height/2];
				this.candy.getCandy(1).addComponentIntance(joint);
		// Laya.timer.loop(1,this,function(){this.candy.candy.x =250; this.candy.candy.y =300});
	}
		contactCandy_3():void{
		// this.rope1.createJoint(this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].body,this.rope1.ropePointsArray[this.rope1.ropePointsArray.length-1].anchor,
		// 	this.candy.body,this.candy.anchor,this.candy.candy);
			/*this.rope2.createJoint(this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].body,this.rope2.ropePointsArray[this.rope2.ropePointsArray.length-1].anchor,
				this.candy.body,this.candy.anchor,this.candy.candy);*/
				let joint = new Laya.RevoluteJoint();
				let point = this.rope3.ropePointsArray[this.rope3.ropePointsArray.length-1];
				joint.otherBody = point.rp.getComponent(Laya.RigidBody);
				joint.selfBody = this.candy.getBody(2);
				joint.anchor = [this.candy.getCandy(2).width/2,this.candy.getCandy(2).height/2];
				this.candy.getCandy(2).addComponentIntance(joint);
		// Laya.timer.loop(1,this,function(){this.candy.candy.x =250; this.candy.candy.y =300});
	}
      /**角度处理函数
     * 
     *  传入 fx,fy,sx,sy
     * 
     *  获取正选 或余弦  或正切
     * 
     *  返回 对应值
     * 
     *  sin  对边/斜边
     *  cos  临边/斜边
     *  tan  对边/临边
     * 
     *  方向注释
     *  以f为中心，
     *  获取 与s连线和水平线正方向的夹角的 
     *      cos
     *      sin
     *  
     * */
    public rotationDeal(fx:number,fy:number,sx:number,sy:number,getString) : number
    {
        /**斜边 */
        let c : number = Math.sqrt(Math.pow(fx - sx,2) + Math.pow(fy - sy,2));
        /**临边 */
        let a : number = sx - fx;
        /**对边 */
        let b : number = sy - fy;
        
        if(getString == "sin")
        {
            //console.log("#sin ==" + (b/c));
            return (b/c);
        }
        else if(getString == "cos")
        {
            //console.log("#cos ==" + (a/c));
            return (a/c);
        }
        else
        {
            //console.log("#tan ==" + (b/a));//对边 比 临边 
            return (b/a);
        }
    }
}
//激活启动类
new Main();
