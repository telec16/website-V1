module sphere_shell(sphere_r)
{
    difference(){
        sphere(sphere_r);
        sphere(sphere_r*.9);
        translate([0,0,sphere_r])
        cylinder(h=sphere_r, r=sphere_r/20, center=true);
    }
}

module stereo(sphere_r, inter, inv_diff, diff, c=10)
{
    union(){
        
    if(inter==true){
        intersection(){
            
            translate([0,0,sphere_r*1.1])
                sphere_shell(sphere_r);
            linear_extrude(height = sphere_r*2.1, convexity=c, scale=0.01)
                children();
        }
    }
    
    if(inv_diff==true){
        difference(){
            
            translate([0,0,sphere_r*1.1])
                sphere_shell(sphere_r);
            
            linear_extrude(height = sphere_r*2.1, convexity=c, scale=0.01)
                projection(false)
                    linear_extrude(height = sphere_r*2.1, convexity=c, scale=0.01)
                        children();
        }
    }
    
    if(diff==true){
        difference(){
            
            translate([0,0,sphere_r*1.1])
                sphere_shell(sphere_r);
            
            #linear_extrude(height = sphere_r*2.1, convexity=c, scale=0.01)
                children();
        }
    }
    }
}

$fn=50;
stereo(2, false, false, true)
    import (file = "heart.dxf", center=true);



