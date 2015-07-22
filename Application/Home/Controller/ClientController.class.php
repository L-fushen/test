<?php
namespace Home\Controller;
use Think\Controller;
class ClientController extends Controller {
    public function index(){
        $this->display(APP_PATH.'Home/View/Client-list.html');
    }
}