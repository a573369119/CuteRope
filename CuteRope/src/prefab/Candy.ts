import GameConfig from "../config/GameConfig";
import Dic from "../Tool/dic";

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
    /**假如的层 */
    public view : Laya.Panel;
    public candy_JointArray:Array<Laya.RevoluteJoint>;
    
    constructor(view){
        this.view = view;
        this.candy_JointArray=new Array<Laya.RevoluteJoint>();
        this.arr_Body = new Array<Laya.RigidBody>();
        this.arr_Colider = new Array<Laya.BoxCollider>();
        this.arr_Sp = new Array<Laya.Sprite>();
    }

    //初始化,糖果仅有图片的更换  count绳子数量
    init(data,count):void{
        this.count = count;
        this.candy_X=data.x;
        this.candy_Y=data.y;
        this.style = data.style;
        this.candy_CreateSprite(data.x,data.y,data.style);
        this.candy_AddBody();
        this.candy_AddCom();
        this.set("nog");
        
        console.log(this.arr_Sp);
        console.log(this.arr_Body);
    }
    
    //更新状态
    update(data,count):void{
        this.count = count;
        this.candy_X=data.x;
        this.candy_Y=data.y;
        this.style=data.style;
        this.candy_CreateSprite(data.x,data.y,data.style);
        for(let i=0;i<this.count;i++)
        {
            this.arr_Sp[i].scaleX = 1;
            this.arr_Sp[i].scaleY = 1;
            this.arr_Sp[i].pos(this.candy_X,this.candy_Y);
            this.arr_Sp[i].loadImage("gameView/"+data.style+".png");
        }
        this.arr_Sp[0].visible = true;
        this.candy_AddBody();
        // this.candy_AddColider();
        this.candy_AddCom();
        this.set("nog");
        
        console.log(this.arr_Sp);
        console.log(this.arr_Body);
    }

    //创建糖果精灵
    candy_CreateSprite(x,y,style):void{
        for(let i=0; i<this.count;i++)
        {
            if(!this.arr_Sp[i]) this.arr_Sp[i]=new Laya.Sprite();//不存在 才新创建
            this.arr_Sp[i].loadImage("gameView/"+style+".png");
            this.arr_Sp[i].zOrder=1;
            this.arr_Sp[i].pivot(this.arr_Sp[i].width/2,this.arr_Sp[i].height/2);
            this.arr_Sp[i].pos(x,y);
            //没有加上舞台i
            if(i!=0) this.arr_Sp[i].visible = false; 
            this.view.addChild(this.arr_Sp[i]);
        }
    }

    //添加RigidBody组件,设置刚体属性
    candy_AddBody():void{   
        let body : Laya.RigidBody;
        for(let i=0;i<this.count; i++)
        {
            body=new Laya.RigidBody();
            body.type="dynamic";
            body.allowRotation = true;
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
            if(!this.arr_Colider[i]) this.arr_Colider[i] = new Laya.BoxCollider();
            this.arr_Colider[i].width = this.arr_Sp[i].width;
            this.arr_Colider[i].height = this.arr_Sp[i].height;
            this.arr_Colider[i].isSensor=true;
            this.arr_Colider[i].density = GameConfig.CANDY_DENSITY;
            this.arr_Sp[i].addComponentIntance(this.arr_Colider[i]);
        }
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

    /**得到糖果结合体 sprite*/
    public getCandySprite(index) : Laya.Sprite
    {
        return this.arr_Sp[index];
    }

    /**得到糖果结合体 body*/
    public getCandyBody(index) : Laya.RigidBody
    {
        return this.arr_Body[index];
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
			}
        });
        ////
    }

    /** 糖果 被吃*/
    public candyDestroy(x,y) : void
    {
        let rigidBody;
        console.log(this.arr_Sp);
        this.arr_Sp.forEach(sp => {
            rigidBody = sp.getComponents(Laya.RigidBody)[0];
            rigidBody.destroy();
            rigidBody = sp.getComponents(Laya.RevoluteJoint)[0];
            rigidBody.destroy();
        });
        Laya.timer.loop(1,this,this.nearMonster,[x,y]);
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
    }
}