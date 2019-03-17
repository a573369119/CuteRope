/**
 * 地图配置 ， 纯数据
 */
export module Config {
    export class ConfigManger{
        constructor(){
            
        }
        public static ins : ConfigManger = new ConfigManger();
        
        /**获取地图配置MapConfig getMapConfig("0-0",0)  */
        public getMapConfig(mapWhere:string,mapId:number) : MapConfig
        {   
            let object = Laya.loader.getRes("config/mapConfig.json");
            let objectMapConfig ;
            for(let i =0;i<object.length; i++)
            {
                console.log("获取得长度"+object.length);
                if(object[i].mapWhere == mapWhere)
                {
                    for(let h=0; h<object[i].mapList.length ;h++)
                    {
                        if(mapId == object[i].mapList[h].mapId)
                        {
                            objectMapConfig =  object[i].mapList[h];
                            // Laya.loader.clearRes(x"config/mapConfig.json");
                            return new MapConfig(objectMapConfig);
                        }
                    }
                    break;
                }
            }
            // Laya.loader.clearRes("config/mapConfig.json");
            console.log("没有此配置 mapId = " + mapId);
            return null;
        }
    }

    export class MapConfig {
        /**mapWhere */
        public mapWhere : string;
        /**地图皮肤 组*/
        public arr_MapSkin : Array<string>;
        /**地图皮肤 对应位置 */
        public arr_MapSkinPos : Array<any>;
        /**路径 自动识别横竖 横默认为x number  竖默认为y number*/
        public screenRoad : Array<number>;
        /**mapId */
        public mapId : number;
        /**地图宽度 */
        public width : number;
        /**地图高度 */
        public height : number;
        /**糖果配置 */
        public candyConfig : CandyConfig;
        /**糖果2配置 */
        public candyConfig2 : CandyConfig;
        /**星星配置 数组 */
        public arr_Star : Array<StarConfig>;
        /**怪物配置 */
        public monster : MonsterConfig;
        /**反重力按钮配置 */
        public antiGravity:AntiGravityConfig;
        /**hook配置 */
        public arr_Hook : Array<HookConfig>;
        /**rope配置 数组*/
        public arr_Rope : Array<RopeConfig>;
        /**rope配置 数组*/
        public arr_Rope2 : Array<RopeConfig>;
        /**泡泡 balloon*/
        public arr_Balloon : Array<BalloonConfig>;
        /**锥子 knife*/
        public arr_Knife : Array<KnifeConfig>;
        /**推力球 forceball*/
        public arr_Forceball : Array<ForceBallConfig>;
        /**魔术帽 */
        public arr_MagicHat : Array<MagicHatConfig>;
        /**激光 */
        public arr_Laser : Array<LaserConfig>;
        /**蜘蛛 */
        public arr_Spider : Array<SpiderConfig>;
        /**弹力鼓 */
        public arr_bounceDrum : Array<BounceDrumConfig>;
        
        constructor(data){
            this.screenRoad = [];
            this.arr_MapSkinPos = [];
            this.arr_MapSkin = [];
            this.arr_Hook = [];
            this.arr_Rope = [];
            this.arr_Rope2 = [];
            this.arr_Star = [];
            this.arr_MapSkin = [];
            this.arr_Balloon = [];
            this.arr_MagicHat = [];
            this.arr_Knife=[];
            this.arr_Forceball=[];
            this.arr_Laser=[];
            this.arr_Spider=[];
            this.arr_bounceDrum=[];
            this.parseConfigData(data);
        }

        /**解析读取数组 */
        private parseConfigData(data) : void
        {
            //地图本身配置
            this.mapId = data.mapId;
            this.width = data.width;
            this.height = data.height 
            this.screenRoad = data.screenRoad;
            //皮肤读取
            data.mapSkins.forEach(skin => {
                this.arr_MapSkin.push(skin.skin);
                this.arr_MapSkinPos.push({x:skin.x,y:skin.y,height:skin.height,width:skin.width});
            });
            /**星星 */
            this.parseStar(data.star);
            /**糖果 */
            this.parseCandy(data.candy,data.candy2);
            /**怪物 */
            this.parseMonster(data.monster);
            /**Hook  锚点*/
            this.parseHook(data.hook);
            /**绳子 */
            this.parseRope(data.rope);
            /**绳子2 */
            this.parseRope2(data.rope2);
            /**泡泡解析 */
            this.parseBalloon(data.balloon);
            /**解析帽子 */
            this.parseMagicHat(data.magicHat);
            /**锥子解析 */
            this.parseKnife(data.knife);
            /**推力球解析 */
            this.parseForceBall(data.forceball);
            /**激光解析 */
            this.parseLaser(data.laser);
            /**蜘蛛解析 */
            this.parseSpider(data.spider);
            /**弹力鼓解析 */
            this.parseBounceDrum(data.bounceDrum);
            /**反重力按钮解析 */
            this.parseAntiGravity(data.antiGravity);
        }

        /**蜘蛛 */
        private parseSpider(spiderObject) : void
        {
            if(spiderObject)
            {
                
                    let spiderConfig : SpiderConfig;           
                        spiderObject.forEach(obj => {
                        spiderConfig = new SpiderConfig();
                        spiderConfig.spider_X = obj.x;
                        spiderConfig.spider_Y = obj.y;
                        this.arr_Spider.push(spiderConfig);
                        });
                console.log("spider -解析");    
                
            }
        }

        /**弹力鼓解析 */
        private parseBounceDrum(bounceDrumObject) : void
        {
            if(!bounceDrumObject) return;
            let bounceDrumConfig : BounceDrumConfig;
            for(let i=0; i<bounceDrumObject.length; i++)
            {
                bounceDrumConfig = new BounceDrumConfig();
                bounceDrumConfig.bounceDrum_X = bounceDrumObject[i].x;
                bounceDrumConfig.bounceDrum_Y = bounceDrumObject[i].y;    
                bounceDrumConfig.rotation = bounceDrumObject[i].rotation;
                bounceDrumConfig.size = bounceDrumObject[i].size; 

                if(bounceDrumObject[i].moveTo) bounceDrumConfig.moveTo = bounceDrumObject[i].moveTo;
                if(bounceDrumObject[i].rotationV) bounceDrumConfig.rotationV = bounceDrumObject[i].rotationV;
                if(bounceDrumObject[i].power) bounceDrumConfig.power = bounceDrumObject[i].power;        

                this.arr_bounceDrum.push(bounceDrumConfig);
            }
        }

        /**绳子节点2解析 */
        private parseRope2(rope2) : void
        {
            if(!rope2) return;
            let ropeConfig : RopeConfig;
            for(let i=0; i<rope2.length.length; i++)
            {
                ropeConfig = new RopeConfig();
                ropeConfig.num = rope2.length[i];
                ropeConfig.hookIndex = -1;                
                if(rope2.hookIndex)
                {
                    if(rope2.hookIndex[i] || rope2.hookIndex[i] == 0)
                    ropeConfig.hookIndex = rope2.hookIndex[i];
                }
                this.arr_Rope2.push(ropeConfig);
            }
        }

        /**绳子节点解析 */
        private parseRope(rope) : void
        {
            let ropeConfig : RopeConfig;          
            for(let i=0; i<rope.length.length; i++)
            {
                ropeConfig = new RopeConfig();
                ropeConfig.num = rope.length[i];
                ropeConfig.hookIndex = -1;                
                if(rope.hookIndex)
                {
                    if(rope.hookIndex[i] || rope.hookIndex[i] == 0)
                    ropeConfig.hookIndex = rope.hookIndex[i];
                }
                if(rope.shortNumber)
                {
                    if(rope.shortNumber[i] || rope.shortNumber[i] == 0)
                    {
                        ropeConfig.shortNumber = rope.shortNumber[i];
                    }
                }
                this.arr_Rope.push(ropeConfig);
            }
            console.log("rope -解析");
        } 
        /**钩子hook */
        private parseHook(hookObject) : void
        {
            let hookConfig : HookConfig;           
            hookObject.forEach(obj => {
                hookConfig = new HookConfig();
                hookConfig.style=obj.style;
                hookConfig.hook_X = obj.x;
                hookConfig.hook_Y = obj.y;
                if(obj.size)
                {
                    hookConfig.size = obj.size;
                }
                if(obj.length)
                {
                    hookConfig.rotation=obj.rotation;
                    hookConfig.length=obj.length;
                    hookConfig.percent=obj.percent;                    
                }
                if(obj.canRotate)
                {
                    hookConfig.canRotate = obj.canRotate;
                }
                else
                {
                    hookConfig.canRotate = false;
                }
                this.arr_Hook.push(hookConfig);
            });
            console.log("hook -解析");            
        }
        /**怪物 */
        private parseMonster(monster) : void
        {
            this.monster = new MonsterConfig();
            this.monster.monster_X = monster.x;
            this.monster.monster_Y = monster.y;
            console.log("monster -解析");
            
        }
        /**糖果 */
        private parseCandy(candy,candy2) : void
        {
            this.candyConfig = new CandyConfig();
            this.candyConfig.candy_X = candy.x;
            this.candyConfig.candy_Y = candy.y;
            this.candyConfig.style = candy.style;
            console.log("candy -解析");
            if(candy2)
            {
                this.candyConfig2 = new CandyConfig();
                this.candyConfig2.candy_X = candy2.x;
                this.candyConfig2.candy_Y = candy2.y;
                this.candyConfig2.style = candy2.style;
            }
            
        }


        /**解析星星 */
        private parseStar(starObject) : void
        {
            let starConfig : StarConfig;
            starObject.forEach(obj => {
                starConfig = new StarConfig();
                starConfig.style = obj.style;
                starConfig.star_X = obj.x;
                starConfig.star_Y = obj.y;
                starConfig.interval = obj.interval;
                starConfig.move = obj.move;
                starConfig.rotateLength = obj.rotateLength;
                starConfig.v = obj.v;
                this.arr_Star.push(starConfig);
            });
            console.log("star -解析");
            
        }

        /**泡泡 */
        private parseBalloon(balloonObject) : void
        {
            if(balloonObject)
            {
                
                    let balloonConfig : BalloonConfig;           
                        balloonObject.forEach(obj => {
                        balloonConfig = new BalloonConfig();
                        balloonConfig.balloon_X = obj.x;
                        balloonConfig.balloon_Y = obj.y;
                        this.arr_Balloon.push(balloonConfig);
                        });
                console.log("balloon -解析");    
                
            }
        }

        /**锥子 */
        private parseKnife(knifeObject) : void
        {
            if(knifeObject)
            {                
                    let knifeConfig : KnifeConfig;           
                        knifeObject.forEach(obj => {
                        knifeConfig = new KnifeConfig();
                        knifeConfig.knife_X = obj.x;
                        knifeConfig.knife_Y = obj.y;                        
                        knifeConfig.style=obj.style;
                        knifeConfig.rotation=obj.rotation;
                        knifeConfig.v=obj.v;
                        knifeConfig.move=obj.move;
                        this.arr_Knife.push(knifeConfig);
                        });
                console.log("knife -解析");    
            }
        }

        /**推力球 */
        private parseForceBall(forceballObject) : void
        {
            if(forceballObject)
            {                
                    let forceballConfig : ForceBallConfig;           
                        forceballObject.forEach(obj => {
                        forceballConfig = new ForceBallConfig();
                        forceballConfig.forceball_X = obj.x;
                        forceballConfig.forceball_Y = obj.y;
                        forceballConfig.rotation=obj.rotation;
                        this.arr_Forceball.push(forceballConfig);
                        });
                console.log("forceball -解析");    
            }
        }
        /**魔术帽 */
        private parseMagicHat(magicHatObject) : void
        {
            if(magicHatObject)
            {
                let magicHatConfig : MagicHatConfig;
                magicHatObject.forEach(magicHat => {
                    magicHatConfig = new MagicHatConfig();
                    magicHatConfig.magicHat_X1 = magicHat.x1;
                    magicHatConfig.magicHat_Y1 = magicHat.y1;
                    magicHatConfig.rotation1 = magicHat.rotation1;
                    magicHatConfig.magicHat_X2 = magicHat.x2;
                    magicHatConfig.magicHat_Y2 = magicHat.y2;
                    magicHatConfig.rotation2 = magicHat.rotation2;
                    magicHatConfig.color=magicHat.color;
                    magicHatConfig.move1=magicHat.move1;
                    magicHatConfig.move2=magicHat.move2;
                    magicHatConfig.rotate1=magicHat.rotate1;
                    magicHatConfig.rotate2=magicHat.rotate2;
                    magicHatConfig.v1=magicHat.v1;
                    magicHatConfig.v2=magicHat.v2;
                    this.arr_MagicHat.push(magicHatConfig);
                });
            }
        }

        /**激光 */
        private parseLaser(laserObject) : void
        {
            if(laserObject)
            {
                
                    let laserConfig : LaserConfig;           
                        laserObject.forEach(obj => {
                        laserConfig = new LaserConfig();
                        laserConfig.laser_X = obj.x;
                        laserConfig.laser_Y = obj.y;
                        laserConfig.isAdvanceLaser=obj.isAdvanceLaser;
                        laserConfig.time=obj.time;
                        laserConfig.move=obj.move;
                        laserConfig.rotation=obj.rotation;
                        this.arr_Laser.push(laserConfig);
                        });
                console.log("spider -解析");    
                
            }
        }

        /**反重力按钮 */
        private parseAntiGravity(antiGravity) : void
        {
            if(antiGravity){
                this.antiGravity = new AntiGravityConfig();
                this.antiGravity.antiGravity_X = antiGravity.x;
                this.antiGravity.antiGravity_Y = antiGravity.y;
                console.log("antiGravity-解析");
            }  
        }
    }

    /**candy */
    export class CandyConfig {
        /**糖果类型 */
        public style : string;
        /**糖果初始x位置**/
        public candy_X : number;
        /** 糖果初始y位置**/
        public candy_Y : number;
        /** */
        constructor(){
            
        }
    }
    /**star */
    export class StarConfig {
        /*星星类型 */
        public style : string;
        /**动画帧间隔 */
        public interval:number;
        /**移动到某点 */
        public move:Array<number>;
        /**绕某点做圆周运动的半径长 */
        public rotateLength:number;
        /**绕某点做圆周运动的速度 */
        public v:number;
        /**星星初始x位置**/
        public star_X : number;
        /**星星初始y位置**/
        public star_Y : number;
        /**星星消失事件？*/
        public star_DestroyTime : number;
        constructor(){
            
        }
    }

    /**怪物 */
    export class MonsterConfig{
        /**怪物x位置 */
        public monster_X : number;
        /**怪物y位置 */
        public monster_Y : number;
        constructor(){
            
        }
    }

    /**钩子*/
    export class HookConfig{
        /**横坐标 */
        public hook_X : number;
        /**纵坐标 */
        public hook_Y : number;
        /**钩子类型 */
        public style : string;
        /**hook3范围 */
        public size : number;
        /**旋转角度(hook3) */
        public rotation:number;
        /**长度 */
        public length : number;
        /**点在的位置 */
        public percent : number;
        /**是否可旋转 */
        public canRotate : boolean;
        constructor(){

        }
    }

    /**绳子 */
    export class RopeConfig{
        /** 长度像素     */
        public num : number;  
        /** 绳子所属 hook**/
        public hookIndex : number;      
        /** 绳子缩短多少个ropepoint */
        public shortNumber : number;
    }

    /**泡泡 balloon*/
    export class BalloonConfig{
        /**横坐标 */
        public balloon_X : number;
        /**纵坐标 */
        public balloon_Y : number;
    }

    /**锥子 balloon*/
    export class KnifeConfig{
        /**横坐标 */
        public knife_X : number;
        /**纵坐标 */
        public knife_Y : number;
        /**锥子类型 */
        public style : string;
        /**旋转角度 */
        public rotation : number;
        /**自转角速度 */
        public v:number;
        /**移动到某点 */
        public move:Array<number>;
    }


    /**推力球 balloon*/
    export class ForceBallConfig{
        /**横坐标 */
        public forceball_X : number;
        /**纵坐标 */
        public forceball_Y : number;
        /**旋转角度 */
        public rotation : number;
    }

    /**帽子 */
    export class MagicHatConfig{
        /**帽子1横坐标 */
        public magicHat_X1 : number;
        /**帽子2横坐标 */
        public magicHat_X2 : number;
        /**帽子1纵坐标 */
        public magicHat_Y1 : number;
        /**帽子2纵坐标 */
        public magicHat_Y2 : number;
        /**帽子1旋转角度 */
        public rotation1 : number;
        /**帽子2旋转角度 */
        public rotation2 : number;
        /**颜色 */
        public color:string;
        /**帽子1移动到某点 */
        public move1:Array<number>;
        /**帽子2移动到某点 */
        public move2:Array<number>;
        /**帽子1绕某点旋转长度，默认竖直向下 */
        public rotate1:number;
        /**帽子2绕某点旋转 */
        public rotate2:number;
        /**帽子1绕某点旋转角速度 */
        public v1:number;
        /**帽子2绕某点旋转 */
        public v2:number;
    }

    /**激光 laser*/
    export class LaserConfig{
        /**横坐标 */
        public laser_X : number;
        /**纵坐标 */
        public laser_Y : number;
        /**是否优先发射激光 */
        public isAdvanceLaser:boolean;
        /**发射激光间隔时间,单位为秒 */
        public time:number;
        /**移动到某点 */
        public move:Array<number>;
        /**旋转角度 */
        public rotation : number;
    }

    /**蜘蛛 balloon*/
    export class SpiderConfig{
        /**横坐标 */
        public spider_X : number;
        /**纵坐标 */
        public spider_Y : number;
        /**所在绳子的下标 */
        public ropeIndex : number;
    } 

    /**弹力鼓 */
    export class BounceDrumConfig{
        /**横坐标 */
        public bounceDrum_X: number ;
        /**纵坐标 */
        public bounceDrum_Y: number;
        /**方向 */
        public rotation : number;
        /**缩放倍数 正常大小 1**/
        public size : number;
        /**弹力系数 */
        public power : number;
        /**旋转速度 */
        public rotationV : number;
        /**移动到 */
        public moveTo : Array<any>;
    }

    /**反重力按钮 antiGravity*/
    export class AntiGravityConfig{
        /**横坐标 */
        public antiGravity_X : number;
        /**纵坐标 */
        public antiGravity_Y : number;
    }
}