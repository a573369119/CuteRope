import GameConfig from "../config/GameConfig";
import Tool from "../Tool/Tool";
import Dic from "../Tool/dic";
import ForceBall from "./ForceBall";

/**
 * cd盘
 */
export default class Cd{
    /**view */
    public view : any;
    /**精灵*/
    public sp : Laya.Sprite;
    /**hookIndex数组 */
    public arr_HookIndex : Array<number>;
    /**balloonIndex数组 */
    public arr_BalloonIndex : Array<number>;
    /**forceball */
    public arr_forceballIndex : Array<number>;
    /**记录点 */
    public oldPos : any;
    /**left */
    public leftImg : Laya.Image;
    /**right */
    public rightImg : Laya.Image;


    // public testImg : Laya.Image;
    private testDic : number;
    
    constructor(view){
        this.view = view;
    }
    
    /**初始化 */
    public init(data) : void
    {
        this.createSp(data);
        this.dataInit();
        this.setChildren(data.arr_hookIndex,data.arr_balloonIndex,data.arr_forceball);
    }

    /**更新 */
    public update(data) : void
    {
        this.createSp(data);
        this.dataInit();        
        this.setChildren(data.arr_hookIndex,data.arr_balloonIndex,data.arr_forceball);    
            
    }

    /**数据初始化 */
    private dataInit() : void
    {
        this.arr_HookIndex = [];
        this.arr_BalloonIndex = [];
    }

    /**设置关联 */
    private setChildren(arr_HookIndex,arr_BalloonIndex,arr_forceball) : void
    {
        this.arr_BalloonIndex = arr_BalloonIndex;
        this.arr_HookIndex = arr_HookIndex;
        this.arr_forceballIndex = arr_forceball;
    }

    /**创建精灵 */
    private createSp(data) : void
    {
        if(!this.sp)
        {
            this.sp = new Laya.Sprite();
            this.sp.loadImage("gameView/cD/cd.png");
            this.sp.zOrder = GameConfig.ZORDER_CD;
            this.sp.mouseThrough = true;
            this.view.addChild(this.sp);
            this.oldPos = {};
        }
        this.sp.width = data.size[0];
        this.sp.height = data.size[1];
        this.sp.pivot(this.sp.width/2,this.sp.height/2);
        this.sp.x = data.x ;
        this.sp.y = data.y ;
        this.sp.rotation = 0;
        this.sp.visible = true;
        this.createLRImg();
    }

    /**创建左右图片 */
    private createLRImg() : void
    {
        if(!this.leftImg)
        {
            this.leftImg = new Laya.Image();
            this.leftImg.skin = "gameView/cD/cdL.png";
            this.leftImg.width = 35;
            this.leftImg.height = 50;
            this.leftImg.pivot(0,this.leftImg.height/2);
            this.sp.addChild(this.leftImg);

            ///测试
            // this.testImg = new Laya.Image();
            // this.testImg.skin = "gameView/cD/cdL.png";
            // this.testImg.x = 240;
            // this.testImg.zOrder = 10000;
            // this.testImg.y =250;
            // this.view.addChild(this.testImg);
        }
        this.leftImg.y = this.sp.height/2;
        this.leftImg.x = 0;
        if(this.rightImg) this.rightImg.visible = false;
        //右图片
        if(this.sp.width > 100)
        {
            if(!this.rightImg)
            {
                this.rightImg = new Laya.Image();
                this.rightImg.skin = "gameView/cD/cdR.png";
                this.rightImg.width = 35;
                this.rightImg.height = 50;
                this.rightImg.pivot(this.rightImg.width,this.rightImg.height/2);
                this.sp.addChild(this.rightImg) ;
            }
            this.rightImg.x = this.sp.width;
            this.rightImg.y = this.sp.height/2;
            this.rightImg.visible = true;
        }
    } 

    /**清除 */
    public clearTimer() : void
    {
        this.sp.visible = false;
        this.oldPos = {};
        this.arr_BalloonIndex = [];
        this.arr_HookIndex = [];
    }

    /**旋转逻辑 鼠标x y*/
    public mouseRotateCd(x,y,arr_hook,arr_balloon,arr_forceball) : number
    {
        x = x - this.sp.x;
        y = y - this.sp.y;
        if(this.oldPos.x == undefined || this.oldPos.y == undefined)
        {
            this.oldPos.x = x;
            this.oldPos.y = y;
            return;
        }
        let fM = Math.sqrt(Math.pow(x,2)+Math.pow(y,2))*Math.sqrt(Math.pow(this.oldPos.x,2)+Math.pow(this.oldPos.y,2));
        let fZ = x*this.oldPos.x + y*this.oldPos.y;
        let rotation = Math.acos(fZ/fM)*180/Math.PI;
        if(rotation>4)
        {
            rotation=4;
        }
        console.log("rotation::" + rotation);
        let num = this.judge(x,y,this.oldPos);
        this.oldPos.x = x;
        this.oldPos.y = y;
        if(fM > fZ && num) 
        {
            this.rotateHook(num*rotation,arr_forceball);
            this.roHook(num*rotation,arr_hook,1);//hook
            this.roHook(num*rotation,arr_balloon,2);//泡泡
            // this.roHook(num*rotation,arr_forceball);
        }
        else
        {
            this.roHook(0,arr_hook,1);
            this.roHook(0,arr_balloon,2);
        }
        return ;
    }

    /**正负判断 */
    private judge(x,y,oldPos) : number
    {
        let cZ : any = {};
        let num;
        cZ.x = 1/oldPos.x;
        cZ.y = -1/oldPos.y;
        if(oldPos.x == 0)
        {
            cZ.x = 1;
            cZ.y = 0;
        }
        if(oldPos.y == 0)
        {
            cZ.x = 0;
            cZ.y = 1;
        }
        num = cZ.x*x+cZ.y*y;
        // console.log("[x]" + cZ.x*x + "[y]" + cZ.y*y);8
        if((x) >= 0 && (y) <0 || (x) <= 0 && (y) >0)
        {
            num = -num;
            // console.log("【"+num+"】");
        }
        if(num > 0) return -1;
        return 1;
    }


    /**hook旋转 */
    private rotateHook(rotation,arr_forceball) : void
    {
        this.sp.rotation +=rotation;
        if(!arr_forceball) return; 
        for(let i=0;i<this.arr_forceballIndex.length;i++)
        {
            for(let h=0;h<arr_forceball.length;h++)
            {
                if(this.arr_forceballIndex[i] == h)
                {
                    arr_forceball[h].setRotation(rotation);
                    arr_forceball[h].setPosChange(this.sp.x - this.sp.pivotX, this.sp.y - this.sp.pivotY);
                }
            }
        }

    }
    

    /***旋转测试 */
    private roHook(roValue,arr,type) : void
    {
        roValue = roValue*Math.PI/180;
        this.rotationByType(roValue,arr,type);
    }

    private rotationByType(roValue,arr,type) : void
    {
        let arr_obj;
        switch(type)
        {
            case 1:arr_obj = this.arr_HookIndex;break;
            case 2:arr_obj = this.arr_BalloonIndex;break;
        }
        for(let i = 0;i<arr_obj.length;i++)
        {
            if(arr_obj[i] === undefined) continue;
            let hook = arr[arr_obj[i]];
            let newX = (hook.sp.x - this.sp.x)*Math.cos(roValue) - (hook.sp.y - this.sp.y)*Math.sin(roValue) + this.sp.x;
            let newY = (hook.sp.x - this.sp.x)*Math.sin(roValue) + (hook.sp.y - this.sp.y)*Math.cos(roValue) + this.sp.y;
            hook.followBee({x:newX,y:newY},roValue);
        }
    }

    public toHookPos(arr_Hook,type) : void
    {
        let arr_obj;
        switch(type)
        {
            case 1:arr_obj = this.arr_HookIndex;break;
            case 2:arr_obj = this.arr_BalloonIndex;break;
        }
        for(let i = 0;i<arr_obj.length;i++)
        {
            if(arr_obj[i] === undefined) continue;
            if(arr_Hook[arr_obj[i]]) arr_Hook[arr_obj[i]].toHook();
        }
    }

    /**zorder */
    public setZorder(num) : void
    {
        this.sp.zOrder = num;
    }

    /**存入hookINdex */
    public addIndex(index,type) : void
    {
        let arr = this.getArrayByType(type);
        for(let i =0;i<arr.length;i++)
        {
            if(index == arr[i]) return;
        }
        for(let i =0;i<arr.length;i++)
        {
            if(arr[i] === undefined)
            {
                arr[i] = index;
                return;
            }
        }
        arr.push(index);
    }
    /**取出 */
    public removIndex(index,type) : void
    {
        let arr = this.getArrayByType(type);        
        for(let i=0;i<arr.length;i++)
        {
            if(index == arr[i])
            {
                if(arr[i+1] == undefined)
                {
                    arr[i] = undefined
                }
                else
                {
                    arr[i] = arr[i+1];
                }
            }
        }
    }

    private getArrayByType(type) : Array<number>
    {
       let arr : any;
       switch(type)
       {
         case 1: arr = this.arr_HookIndex;break; 
         case 2: arr = this.arr_BalloonIndex;break;
       }
        return arr;
    }

    /**判断是否有index */
    public haveIndex(index) : boolean
    {
        for(let i=0;i<this.arr_HookIndex.length;i++)
        {
            if(index == this.arr_HookIndex[i]) return true;
        }
        return false
    }

    /**********写入 */
    public setForceBall(forceball:ForceBall) : void
    {
        forceball.sp.removeSelf();
        forceball.anim1.removeSelf();
        this.sp.addChild(forceball.sp);
        this.sp.addChild(forceball.anim1);
    }
}