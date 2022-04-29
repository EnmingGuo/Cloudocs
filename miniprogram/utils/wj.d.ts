declare type Object = {
    [key: string]: any;
};
declare type ReqOpt = number;
declare type User = any;
declare type Msg = any;
interface initOptions {
    url: string;
}
/**
 * @author 万劫不复ks WJBFks
 * @version 0.0.1
 */
declare var wj: {
    /**
     * 初始化函数
     *
     * 必须在使用前初始化
     *
     * 项目只需要初始化一次即可
     *
     * 建议在app.js中完成
     * @param options 初始化参数
     * @example
     * ```
     * wj.init({
     *   url:`https://test.cn:9000`
     * })
     * ```
     */
    init(options: initOptions): void;
    /**
     * request请求可选参数
     * @param debug debug模式，不发送请求，以log输出请求参数
     *
     * @param token token验证模式，发送请求将在header携带Bearer token
     *
     */
    reqOpt: {
        /**
         * debug模式，不发送请求，以log输出请求参数
         */
        debug: number;
        /**
         * token验证模式，发送请求将在header携带Bearer token
         */
        token: number;
    };
    /**
     * request请求，封装wx.request为Promise风格
     * @param api 请求接口，如 '/login'
     * @param options 可选参数（支持使用 '|' 进行连接）
     * @description options参数列表
     *
     * `wj.reqOpt.debug` debug模式，不发送请求，以log输出请求参数
     *
     * `wj.reqOpt.token` token验证模式，发送请求将在header携带Bearer token
     *
     * @example
     * ```
     * wj.request('/user', wj.reqOpt.debug | wj.reqOpt.token)
     *   .get().then(res=>{
     *     console.log(res)
     *   })
     * ```
     */
    request(api: string, options?: ReqOpt): {
        /**
         * 发送get请求
         */
        get(data?: any): any;
        /**
         * 发送post请求
         * @param data 参数
         */
        post(data: any): any;
        /**
         * 发送put请求
         * @param data 参数
         */
        put(data: any): any;
    };
    /**
     * 用户信息
     * @param openid 留空表示当前登录用户
     * @tips 该接口需要配合对应云函数使用
     */
    user(openid?: string): {
        /**
         * 获取用户信息
         */
        get(): Promise<User>;
        /**
         * 添加/更新用户信息
         * @param data 用户信息
         * @description
         * 如果用户不存在，则`添加`用户信息
         *
         * 如果用户已存在，则`更新`用户信息
         * @example
         * ```
         * wj.user().addup({
         *   userinfo: res.userInfo
         * })
         * ```
         */
        addup(data: any): Promise<Msg>;
    };
    /**
     * 获取时间戳
     * @param ts 时间戳函数或时间戳字符串
     * @description 根据ts获取时间戳，留空则获取当前时间戳
     */
    timeStamp(ts?: string | number): {
        /**
         * 获取时间戳
         */
        get(): number;
        /**
         * 获取日期字符串
         */
        date(): string;
        /**
         * 获取时间字符串
         * @param sec 是否显示秒
         * @description
         * `sec==true`显示秒
         *
         * `sec==false`或留空不显示
         */
        time(sec?: boolean): string;
        /**
        * 获取完整时间字符串（日期和时间）
        * @param sec 是否显示秒
        * @description
        * `sec==true`显示秒
        *
        * `sec==false`或留空不显示
        */
        full(sec?: boolean): string;
    };
    _stringify(obj: any): Object;
};
export default wj;
