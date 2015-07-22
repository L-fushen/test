<?php if (!defined('THINK_PATH')) exit();?><div class="am-cf am-padding-bottom-0">
    <div class="am-fl am-cf">
        <ol class="am-breadcrumb am-breadcrumb-slash">
            <li><a href="#">首页</a></li>
            <li><a href="#">需求列表</a></li>
            <li class="am-active">发布需求</li>
        </ol>
    </div>
    <div class="am-fr">
        <a href="javascript:;" onclick="load_page('<?php echo U('Project/add');?>')" class="am-btn am-btn-default am-btn-xs">返回</a>
    </div>
</div>
<div class="page-bg" style="padding:30px 0">
    <form class="am-form">
        <div class="am-g">
            <div class="am-u-sm-4 am-u-md-2 am-text-right">
                文章标题
            </div>
            <div class="am-u-sm-8 am-u-md-4">
                <input type="text" class="am-input-sm">
            </div>
            <div class="am-hide-sm-only am-u-md-6">*必填，不可重复</div>
        </div>



        <div class="am-g am-margin-top-sm">
            <div class="am-u-sm-12 am-u-md-2 am-text-right admin-form-text">
                内容描述
            </div>
            <div class="am-u-sm-12 am-u-md-10">
                <textarea rows="10" placeholder="请使用富文本编辑插件"></textarea>
            </div>
        </div>
        <div class="am-margin">
            <button type="button" class="am-btn am-btn-primary am-btn-xs">提交保存</button>
        </div>
    </form>
</div>