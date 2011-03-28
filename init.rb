require 'rubygems'
require 'sinatra'
require 'haml'
require 'ninesixty'
require 'hpricot'
require 'open-uri'

get '/print' do
@test = params['codes'];

haml :index

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
		@images[i]= (@doc/"image_small")[i].inner_html 
		@prices[i]= (@doc/"sellprice_us")[i].inner_html
		end
 
  haml :index
  end
 

 
end


