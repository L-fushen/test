<?php
/**
 * qq登陆接口类
 * 实例化类时传入3个参数 app_id,app_key,callback
 * qq接入流程需要自己去QQ互联文档上了解，此类只做回调功能封装
 * arthur:米国村长
 * */
class QqLogin{
    public $app_id;
    public $app_key;
    public $callback;
    public $code;
    public $state;
    public function __construct($app_id,$app_key,$callback){
        //接收从qq登陆页返回来的值
        $this->code = isset($_REQUEST['code'])? $_REQUEST['code'] : '';
        $this->state = isset($_REQUEST['state'])? $_REQUEST['state'] : '';
        //将参数赋值给成员属性
        $this->app_id = $app_id;
        $this->app_key = $app_key;
        $this->callback = $callback;
    }
    /**
     * 获取access_token值
     * @return array 返回包含access_token,过期时间的数组
     * */
    public function get_token(){
        $url = "https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=".$this->app_id."&client_secret=".$this->app_key."&code=".$this->code."&redirect_uri=".urlencode($this->callback);
        $str = $this->visit_url($url);//访问url获得返回值
        parse_str($str,$arr);
        return $arr;
    }
    /**
     * 获取client_id 和 openid
     * @param $access_token access_token验证码
     * @return array 返回包含client_id 和 openid的数组
     * */
    public function get_client_id($access_token){
        $url = 'https://graph.qq.com/oauth2.0/me?access_token='.$access_token;
        $str = $this->visit_url($url);//访问url获得返回值
        return $this->change_callback($str);//返回经过json转码后的数组
    }
    /**
     * 获取用户信息
     * @param $client_id
     * @param $access_token
     * @param $openid
     * @return array 用户的信息数组
     * */
    public function user_info($client_id,$openid,$access_token){
        $url = 'https://graph.qq.com/user/get_user_info?oauth_consumer_key='.$client_id.'&access_token='.$access_token.'&openid='.$openid.'&format=json';
        $str = $this->visit_url($url);
        $arr = json_decode($str,true);
        return $arr;
    }
    /**
     * 请求URL地址，得到返回字符串
     * @param $url qq提供的api接口地址
     * */
    public function visit_url($url){
        static $cache = 0;
        //判断是否之前已经做过验证
        if($cache === 1){
            $str = $this->curl($url);
        }elseif($cache === 2){
            $str = $this->openssl($url);
        }else{
            //是否可以使用cURL
            if(function_exists('curl_init')){
                $str = $this->curl($url);
                $cache = 1;
                //是否可以使用openssl
            }elseif(function_exists('openssl_open') && ini_get("allow_fopen_url")=="1"){
                $str = $this->openssl($url);
                $cache = 2;
            }else{
                die('请开启php配置中的php_curl或php_openssl');
            }
        }
        return $str;
    }
    /**
     * 将字符串转换为可以进行json_decode的格式
     * 将转换后的参数值赋值给成员属性$this->client_id,$this->openid
     * @param $str 返回的callback字符串
     * @return 数组
     * */
    protected function change_callback($str){
        if (strpos($str, "callback") !== false){
            //将字符串修改为可以json解码的格式
            $lpos = strpos($str, "(");
            $rpos = strrpos($str, ")");
            $json  = substr($str, $lpos + 1, $rpos - $lpos -1);
            //转化json
            $result = json_decode($json,true);
            $this->client_id = $result['client_id'];
            $this->openid = $result['openid'];
            return $result;
        }else{
            return false;
        }
    }
    /**
     * 通过curl取得页面返回值
     * 需要打开配置中的php_curl
     * */
    private function curl($url){
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);//允许请求的内容以文件流的形式返回
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);//禁用https
        curl_setopt($ch,CURLOPT_URL,$url);//设置请求的url地址
        $str = curl_exec($ch);//执行发送
        curl_close($ch);
        return $str;
    }
    /**
     * 通过file_get_contents取得页面返回值
     * 需要打开配置中的allow_fopen_url和php_openssl
     * */
    private function openssl($url){
        $str = file_get_contents($url);//取得页面内容
        return $str;
    }
}
