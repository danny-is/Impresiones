require 'rubygems'
require 'sinatra'
require 'haml'
require 'ninesixty'
require 'hpricot'
require 'open-uri'

get '/' do
  
 f = open("http://btc.cr/productfeed.xml") do |f|
 @doc = Hpricot.XML(f)
  
  #fh = File.open("/public/productfeed.xml","r")
	#@doc = Hpricot(fh)
	#fh.close
  
 
	@names = []
	@descriptions = []
	@images = []
	@prices = []
	
  @n = (@doc/"product").length #tamaño 
 	 	
 	 	
 	for i in 0..@n -1 do
		@names[i]= (@doc/"name")[i].inner_html
		@descriptions[i]= (@doc/"description")[i].inner_html
		@images[i]= (@doc/"image_small")[i].inner_html 
		@prices[i]= (@doc/"sellprice_us")[i].inner_html
		end
 
  haml :index
  end
 
 
end