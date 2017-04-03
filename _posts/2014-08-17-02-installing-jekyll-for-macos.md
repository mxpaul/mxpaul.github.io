---
layout: post
title: "Installing jekyll for macos"
description: ""
category: 
tags: []
---

Единственный удобный способ оказался через

sudo gem install jekyll

Предварительно надо установить xcode command line tools, он  уменя уже был
На всякий случай ссылка с описанием, авось пригодится: [тырк](http://internet-inspired.com/wrote/install-jekyll-in-osx-mavericks/)

После коммита этот пост не добавился, а запуск jekyll под linux выдал такую ошибку:

{% highlight ruby %}
Liquid Exception: undefined method `strftime' for nil:NilClass in post
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/filters.rb:43:in `date_to_long_string'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/context.rb:58:in `__send__'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/context.rb:58:in `invoke'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/variable.rb:43:in `render'
/usr/lib/ruby/site_ruby/1.8/rubygems/custom_require.rb:31:in `inject'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/variable.rb:38:in `each'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/variable.rb:38:in `inject'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/variable.rb:38:in `render'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/block.rb:94:in `render_all'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/block.rb:92:in `collect'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/block.rb:92:in `render_all'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/block.rb:82:in `render'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/template.rb:124:in `render'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/tags/include.rb:26:in `render'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/context.rb:91:in `stack'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/tags/include.rb:25:in `render'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/tags/include.rb:20:in `chdir'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/tags/include.rb:20:in `render'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/block.rb:94:in `render_all'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/block.rb:92:in `collect'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/block.rb:92:in `render_all'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/block.rb:82:in `render'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/template.rb:124:in `render'
/usr/lib/ruby/gems/1.8/gems/liquid-2.4.1/lib/liquid/template.rb:132:in `render!'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/convertible.rb:101:in `do_layout'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/page.rb:100:in `render'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/site.rb:204:in `render'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/site.rb:203:in `each'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/site.rb:203:in `render'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/../lib/jekyll/site.rb:41:in `process'
/usr/lib/ruby/gems/1.8/gems/jekyll-0.12.0/bin/jekyll:264
/usr/bin/jekyll:19:in `load'
/usr/bin/jekyll:19
Build Failed
{% endhighlight%}

Решилось исправлением шаблона поста
{% highlight diff %}
diff --git a/_includes/themes/bootstrap-3/post.html b/_includes/themes/bootstrap-3/post.html
index 754ab53..b3216fa 100644
--- a/_includes/themes/bootstrap-3/post.html
+++ b/_includes/themes/bootstrap-3/post.html
@@ -5,7 +5,7 @@
 <div class="row post-full">
   <div class="col-xs-12">
     <div class="date">
-      <span>{{ page.date | date_to_long_string }}</span>
+      <span>{{ site.time | date_to_long_string }}</span>
     </div>
     <div class="content">
       {{ content }}
{% endhighlight%}

Ссылка на [stackoverflow](http://stackoverflow.com/questions/14147167/trying-to-print-post-date-in-jekyll-fails-with-undefined-method-strftime)
которая помогла решить вопрос.

