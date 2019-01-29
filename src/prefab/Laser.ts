import Tool from "../Tool/Tool";
    export default class Laser{
    /**横坐标 */
    private laser_X:number;
    /**纵坐标 */
    private laser_Y:number;
    //激光范围
    public spRect:Laya.Sprite;
    /**激光动画*/
    public anim:Laya.Animation;
    /**所在层 */
    private view : Laya.Panel
    /**是否发射激光 */
    public isAdvanceLaser:boolean;
    /**是否碰撞 */
    public isCollision : boolean;
    /**是否前进 */
    private isGoing:boolean;
    constructor(view){
        this.view=view;
    }

    //初始化激光
    init(data):void{
        this.isCollision=false;
        this.isAdvanceLaser=data.isAdvanceLaser;
        this.laser_CreateLaser(data.laser_X,data.laser_Y,data.time,data.rotation);
        if(data.move[0]){
            this.laser_X=this.spRect.x;
            this.laser_Y=this.spRect.y;
            this.isGoing=true;
            Laya.timer.frameLoop(1,this,this.laser_MoveBySelf,[data.move]);
        }
    }
    
    //更新
    update(data):void{
        this.isCollision=false;
        this.spRect.visible=true;
        this.isAdvanceLaser=data.isAdvanceLaser;
        this.spRect.rotation=data.rotation;
        this.spRect.pos(data.laser_X,data.laser_Y);    
        if(this.isAdvanceLaser){
            this.anim.visible=true;
            this.anim.play(0,true);
            this.isAdvanceLaser=false;
        }else{
            this.anim.visible=false;
            this.anim.stop();
            this.isAdvanceLaser=true;
        }
        Laya.timer.frameLoop(data.time*60,this,this.laser_startLaser);
        if(data.move[0]){
            this.laser_X=this.spRect.x;
            this.laser_Y=this.spRect.y;
            this.isGoing=true;
            Laya.timer.frameLoop(1,this,this.laser_MoveBySelf,[data.move]);
        }
    }

    //创建激光范围和激光动画
    laser_CreateLaser(x,y,time,rotation){
        this.spRect=new Laya.Sprite();
        this.spRect.loadImage("gameView/laser1.png");
        this.spRect.pivot(this.spRect.width/2,this.spRect.height/2);
        this.spRect.rotation=rotation;
        this.spRect.pos(x,y);
        this.view.addChild(this.spRect);

        this.anim=new Laya.Animation();
        this.anim.loadAnimation("GameView/ani/Laser.ani");
        this.spRect.addChild(this.anim);
        if(this.isAdvanceLaser){
            this.anim.visible=true;
            this.anim.play(0,true);
            this.isAdvanceLaser=false;
        }else{
            this.anim.visible=false;
            this.anim.stop();
            this.isAdvanceLaser=true;
        }
        Laya.timer.frameLoop(time*60,this,this.laser_startLaser);
    }
    
    //开始发射激光
    laser_startLaser():void{
        if(this.isAdvanceLaser){
            this.anim.visible=true;
            this.anim.play(0,true);
            this.isAdvanceLaser=false;
        }else{
            this.anim.visible=false;
            this.anim.stop();
            this.isAdvanceLaser=true;
        }
    }

    //激光来回移动
    laser_MoveBySelf(move):void{        
        let x_Add=Tool.rotationDeal(this.laser_X,this.laser_Y,move[0],move[1],"cos");
        let y_Add=Tool.rotationDeal(this.laser_X,this.laser_Y,move[0],move[1],"sin");
        if(this.isGoing){
            this.spRect.x+=x_Add;
            this.spRect.y+=y_Add;
            if(x_Add==0){
                if(this.spRect.y==move[1]){
                    this.isGoing=false;
                }
            }
            else if(y_Add==0){
                if(this.spRect.x==move[0]){
                    this.isGoing=false;
                }
            }
            else
            {
                if(Math.abs(this.spRect.x-move[0])<0.3){
                    this.spRect.x=move[0];
                    this.spRect.y=move[1];
                    this.isGoing=false;
                    
                }
            }
        }else{
            this.spRect.x-=x_Add;
            this.spRect.y-=y_Add;
            if(x_Add==0){
                if(this.spRect.y==this.laser_Y){
                    this.isGoing=true;
                }
            }
            else if(y_Add==0){
                if(this.spRect.x==this.laser_X){
                    this.isGoing=true;
                }
            }else {
                if(Math.abs(this.spRect.x-this.laser_X)<0.3){
                this.spRect.x=this.laser_X;
                this.spRect.y=this.laser_Y;
                this.isGoing=true;
            }
        }
        }
    }
    
    public clearTimer():void{
        Laya.timer.clearAll(this);
    }

    /**假销毁 */
    public destroy() : void
    {
        this.spRect.visible = false;
        this.spRect.x = 100000;
        this.anim.stop();
        this.anim.visible=false;
    }
}