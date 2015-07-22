<?php
/**
 * qq��½�ӿ���
 * ʵ������ʱ����3������ app_id,app_key,callback
 * qq����������Ҫ�Լ�ȥQQ�����ĵ����˽⣬����ֻ���ص����ܷ�װ
 * arthur:�׹��峤
 * */
class QqLogin{
    public $app_id;
    public $app_key;
    public $callback;
    public $code;
    public $state;
    public function __construct($app_id,$app_key,$callback){
        //���մ�qq��½ҳ��������ֵ
        $this->code = isset($_REQUEST['code'])? $_REQUEST['code'] : '';
        $this->state = isset($_REQUEST['state'])? $_REQUEST['state'] : '';
        //��������ֵ����Ա����
        $this->app_id = $app_id;
        $this->app_key = $app_key;
        $this->callback = $callback;
    }
    /**
     * ��ȡaccess_tokenֵ
     * @return array ���ذ���access_token,����ʱ�������
     * */
    public function get_token(){
        $url = "https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id=".$this->app_id."&client_secret=".$this->app_key."&code=".$this->code."&redirect_uri=".urlencode($this->callback);
        $str = $this->visit_url($url);//����url��÷���ֵ
        parse_str($str,$arr);
        return $arr;
    }
    /**
     * ��ȡclient_id �� openid
     * @param $access_token access_token��֤��
     * @return array ���ذ���client_id �� openid������
     * */
    public function get_client_id($access_token){
        $url = 'https://graph.qq.com/oauth2.0/me?access_token='.$access_token;
        $str = $this->visit_url($url);//����url��÷���ֵ
        return $this->change_callback($str);//���ؾ���jsonת��������
    }
    /**
     * ��ȡ�û���Ϣ
     * @param $client_id
     * @param $access_token
     * @param $openid
     * @return array �û�����Ϣ����
     * */
    public function user_info($client_id,$openid,$access_token){
        $url = 'https://graph.qq.com/user/get_user_info?oauth_consumer_key='.$client_id.'&access_token='.$access_token.'&openid='.$openid.'&format=json';
        $str = $this->visit_url($url);
        $arr = json_decode($str,true);
        return $arr;
    }
    /**
     * ����URL��ַ���õ������ַ���
     * @param $url qq�ṩ��api�ӿڵ�ַ
     * */
    public function visit_url($url){
        static $cache = 0;
        //�ж��Ƿ�֮ǰ�Ѿ�������֤
        if($cache === 1){
            $str = $this->curl($url);
        }elseif($cache === 2){
            $str = $this->openssl($url);
        }else{
            //�Ƿ����ʹ��cURL
            if(function_exists('curl_init')){
                $str = $this->curl($url);
                $cache = 1;
                //�Ƿ����ʹ��openssl
            }elseif(function_exists('openssl_open') && ini_get("allow_fopen_url")=="1"){
                $str = $this->openssl($url);
                $cache = 2;
            }else{
                die('�뿪��php�����е�php_curl��php_openssl');
            }
        }
        return $str;
    }
    /**
     * ���ַ���ת��Ϊ���Խ���json_decode�ĸ�ʽ
     * ��ת����Ĳ���ֵ��ֵ����Ա����$this->client_id,$this->openid
     * @param $str ���ص�callback�ַ���
     * @return ����
     * */
    protected function change_callback($str){
        if (strpos($str, "callback") !== false){
            //���ַ����޸�Ϊ����json����ĸ�ʽ
            $lpos = strpos($str, "(");
            $rpos = strrpos($str, ")");
            $json  = substr($str, $lpos + 1, $rpos - $lpos -1);
            //ת��json
            $result = json_decode($json,true);
            $this->client_id = $result['client_id'];
            $this->openid = $result['openid'];
            return $result;
        }else{
            return false;
        }
    }
    /**
     * ͨ��curlȡ��ҳ�淵��ֵ
     * ��Ҫ�������е�php_curl
     * */
    private function curl($url){
        $ch = curl_init();
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);//����������������ļ�������ʽ����
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);//����https
        curl_setopt($ch,CURLOPT_URL,$url);//���������url��ַ
        $str = curl_exec($ch);//ִ�з���
        curl_close($ch);
        return $str;
    }
    /**
     * ͨ��file_get_contentsȡ��ҳ�淵��ֵ
     * ��Ҫ�������е�allow_fopen_url��php_openssl
     * */
    private function openssl($url){
        $str = file_get_contents($url);//ȡ��ҳ������
        return $str;
    }
}
