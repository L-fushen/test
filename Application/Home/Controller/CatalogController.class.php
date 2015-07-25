<?php
namespace Home\Controller;
use Think\Controller;
class CatalogController extends Controller {
    public function index(){
        $this->display(APP_PATH.'Home/View/catalog-list.html');
    }

    public function add()
    {
        $this->display(APP_PATH.'Home/View/catalog-act.html');
    }
}