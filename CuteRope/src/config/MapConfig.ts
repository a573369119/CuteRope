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
        /**mapId */
        public mapId : number;
        /**地图宽度 */
        public width : number;
        /**地图高度 */
        public height : number;
        /**糖果配置 */
        public candyConfig : CandyConfig;
        /**星星配置 数组 */
        public arr_Star : Array<StarConfig>;
        /**怪物配置 */
        public monster : MonsterConfig;
        /**hook配置 */
        public arr_Hook : Array<HookConfig>;
        /**rope配置 数组*/
        public arr_Rope : Array<RopeConfig>;
        /**泡泡 balloon*/
        public arr_Balloon : Array<BalloonConfig>;
        

        constructor(data){
            this.arr_Hook = [];
            this.arr_Rope = [];
            this.arr_Star = [];
            this.arr_MapSkin = [];
            this.parseConfigData(data);
        }

        /**解析读取数组 */
        private parseConfigData(data) : void
        {
            //地图本身配置
            this.mapId = data.mapId;
            this.width = data.width;
            this.height = data.height
            //皮肤读取
            data.mapSkins.forEach(skin => {
                this.arr_MapSkin.push(skin);
            });
            /**星星 */
            this.parseStar(data.star);
            /**糖果 */
            this.parseCandy(data.candy);
            /**怪物 */
            this.parseMonster(data.monster);
            /**Hook  锚点*/
            this.parseHook(data.hook);
            /**绳子 */
            this.parseRope(data.rope);
            /**泡泡解析 */
            this.parseBalloon(data.balloon);
        }

        /**泡泡 */
        private parseBalloon(balloon) : void
        {
            if(balloon)
            {
                this.arr_Balloon = [];
            }
        }

        /**绳子节点解析 */
        private parseRope(rope) : void
        {
            let ropeConfig : RopeConfig;
            rope.length.forEach(length => {
                ropeConfig = new RopeConfig();
                ropeConfig.num = length;
                this.arr_Rope.push(ropeConfig);
            });
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
            this.monster.down_skin = monster.skin;
            console.log("monster -解析");
            
        }
        /**糖果 */
        private parseCandy(candy) : void
        {
            this.candyConfig = new CandyConfig();
            this.candyConfig.candy_X = candy.x;
            this.candyConfig.candy_Y = candy.y;
            this.candyConfig.style = candy.style;
            console.log("candy -解析");
            
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
                this.arr_Star.push(starConfig);
            });
            console.log("star -解析");
            
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
        /**怪物皮肤 */
        public down_skin : string;
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
        constructor(){

        }
    }

    /**绳子 */
    export class RopeConfig{
        /**节点个数(长度) */
        public num : number;        
    }

    /**泡泡 balloon*/
    export class BalloonConfig{
        /**泡泡的位置x*/
        public balloon_X : number;
        /**泡泡的位置 */
        public balloon_Y : number;
        
    }



}