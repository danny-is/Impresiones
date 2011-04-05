require 'rubygems'
require 'sinatra'
require 'haml'
require 'ninesixty'
require 'hpricot'
require 'open-uri'

def render_file(filename)
  contents = File.read('views/'+filename+'.haml')
  Haml::Engine.new(contents).render
end

get '/print' do
  codes = params['codes'];
  arr = codes.split(",")
  
   @codes = []
 	 @names = []
 	 @descriptions = []
 	 @images = []
   @prices = []
   
   f =  open("http://localhost:9393/productfeed.xml") do |f|
   doc = Hpricot.XML(f)
     i=0
    arr.each do |code|
       t = '//code[text()="' + code + '"]/..'
       
       (doc / t ) .each do |p|
       @codes[i] = (p/"code").inner_html
       @names[i]= (p/"name").inner_html
       @descriptions[i]= (p/"description").inner_html
       @images[i]= (p/"image_small").inner_html 
       @prices[i]= (p/"sellprice_us").inner_html
       i+=1
     end
   end
   
   
   end
  
  if arr.length ==1
   haml :print1 , {:layout => :layout_half}
 else arr.length == 6
   haml :print6
 end
   
end

get '/' do
  
 f = open("http://localhost:9393/productfeed.xml") do |f|
 @doc = Hpricot.XML(f)
  
  #fh = File.open("/public/productfeed.xml","r")
	#@doc = Hpricot(fh)
	#fh.close
  
	@codes = []
	@names = []
	@descriptions = []
	@images = []
	@prices = []
	
  @n = (@doc/"product").length #tamaño 
 	 	
 	for i in 0..@n -1 do
 	  @codes[i]= (@doc/"code")[i].inner_html
		@names[i]= (@doc/"name")[i].inner_html
		@descriptions[i]= (@doc/"description")[i].inner_html
		#@images[i]= (@doc/"image_small")[i].inner_html 
		@prices[i]= (@doc/"sellprice_us")[i].inner_html
		end
 haml :index
  
  end
 

 
end
