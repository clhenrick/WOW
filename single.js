var got_first = 0;
var got_second = 0;
var got_third = 0;
var got_none = 0;
var got_one = 0;
var got_peers = 0;
var ajaxed = false;

jQuery(document).ready(function($){
	var burroughs = [
		"David Carroll",
		"Anezka Sebek",
		"Colleen Macklin",
		"Melanie Crean",
		"Anthony Deen",
		"Marko Tandefelt",
		"Scott Pobiner"
	];
	var data;
	var students_left = [];
	var teacher_chosen;
	var prefs = [];
	var student_data = [];
	var students = [];

	$.ajax({
	  dataType: "json",
	  url: "students.json",
	  success: function(d){
	  	var counter = 0;
	  	for(N in d.students){
	  		var peers = d.students[N].peers;
	  		var arr = peers.split(" ");
	  		var counter2 = 0;
	  		for(N2 in d.students){
		  		for(i=0;i<arr.length;i++){
			  		if(N2 == arr[i]){
				  		arr[i] = counter2;
			  		}
		  		}
		  		counter2++;
	  		}
			var s = {
				"id": counter,
				"name": d.students[N].name,
				"current": d.students[N].current,
				"NetID": N,
				"choices" : [d.students[N].choices[0], d.students[N].choices[1], d.students[N].choices[2]],
				"peers": arr, // this will be a problem. need to convert from email to N#
				"thesis" : -1
			}
			for(i=0;i<theses.length;i++){
				if(theses[i].enrolled){
					for(j=0;j<theses[i].enrolled.length;j++){
						if(s.id == theses[i].enrolled[j]){
							s.thesis = i;
						}
					}
				}
			}
			counter++;
			student_data.push(s);
		}
		students = generateStudents(student_data);		
		for(var i=0;i<students.length;i++){
			if(students[i].peers){
			var fr = '';
			for(var j=0;j<students[i].peers.length;j++){
				for(var k=0;k<students.length;k++){
					if(students[k].NetID == students[i].peers[j]){
						fr += students[k].name;
						fr += ', ';
					}
				}
			}
			fr = fr.substr(0, fr.length-2);
			$('.students tbody').append('<tr><td>'+ students[students[i].id].name +'</td><td class="t">'+ burroughs[students[i].choices[0]] +'</td><td class="t">'+ burroughs[students[i].choices[1]] +'</td><td class="t">'+ burroughs[students[i].choices[2]] +'</td><td>'+ fr +'</td><td class="t">'+burroughs[students[i].thesis]+'</td><td class="t">'+students[students[i].id].current+'</td></tr>');
			}
		}
	// Get dataviz data
	var dataviz = dataviz();

  	ajaxed = true;
  	
  	$('#export-csv').click(function(){
  		console.log("set_id: ", set_id);
  	  	var post = {
	  		"sections": [],
	  		"id": set_id
  		}
  		for(i=0;i<theses.length;i++){
  			var t = {};
	  		t.teacher = burroughs[i];
	  		t.students = [];
	  		if(theses[i].enrolled){
	  		for(j=0;j<theses[i].enrolled.length;j++){
		  		t.students.push(students[theses[i].enrolled[j]].NetID);
	  		}
	  		post.sections.push(t);
	  		}
  		}
	  	$.ajax({
		  	url: "exportresult.php",
		  	data: post,
		  	type: "POST",
		  	success: function(data){
			  	$('#export-csv').after(data);
			  	$('#export-csv').remove();
		  	}
	  	});
  	});
  	



	function generateStudents(student_data){
		var students = [];
		for(var i=0;i<student_data.length;i++){
			students[i] = student_data[i];
			students_left.push(students[i].id);	
		}
		return students;
	}


		printResults();


// ************************** FUNCTION DECLARATIONS ************************** //




	function printResults(){
		var c = $('li.blank').clone();
		c.removeClass('blank');
		c.removeClass('off');
		c.addClass('i-'+iteration);
		// c.find('h1').html('Iteration '+iteration);
		$('li.blank').before(c);
		
		// Print to screen
		for(var i=0;i<theses.length;i++){
			var pr = '';
			var en = '';
			if(theses[i].teacher_pref){
			for(var j=0;j<theses[i].teacher_pref.length;j++){
				pr += students[theses[i].teacher_pref[j]].name;
				pr += ', ';
			}
			for(var j=0;j<theses[i].enrolled.length;j++){
				en += students[theses[i].enrolled[j]].name;
				en += ', ';
			}
			pr = pr.substr(0, pr.length-2);
			en = en.substr(0, en.length-2);
			$('.i-' + iteration + ' .theses tbody').append('<tr><td>'+burroughs[i]+'</td><td>'+theses[i].choices[0]+'</td><td>'+theses[i].choices[1]+'</td><td>'+theses[i].choices[2]+'</td><td>'+theses[i].chosen+'</td><td>'+theses[i].not_chosen+'</td><td>'+pr+'</td><td>'+en+'</td></tr>');
			}
		}
	}

	
	function dataviz(){

		for(var i=0;i<students.length;i++){
			if(students[i].choices[0] == students[i].thesis){
				got_first++;
			} else if (students[i].choices[1] == students[i].thesis){
				got_second++;
			} else if (students[i].choices[2] == students[i].thesis){
				got_third++
			} else {
				got_none++;
			}
			var peers = students[i].peers;
			var flag = false;
			for(var j=0;j<peers.length;j++){
				var peer_id = peers[j];
				var peer; 
				for(var k=0;k<students.length;k++){
					if(students[k].NetID == peer_id){
						peer = students[k];
						if(peer.thesis == students[i].thesis){
							flag = true;
						}
					}
				}
			}
			if(flag){
				got_peers++;
			}
		}

		got_one = got_first+got_second+got_third;

		var dataviz = {
			"got_first" : got_first,
			"got_second" : got_second,
			"got_third" : got_third,
			"got_none" : got_none,
			"got_one" : got_one,
			"got_peers" : got_peers
		}

		

		$('.dataviz tbody').append('<tr><td>'+dataviz.got_first+' -> '+ (dataviz.got_first/students.length)*100 +'%</td><td>'+dataviz.got_second+' -> '+ (dataviz.got_second/students.length)*100+'%</td><td>'+dataviz.got_third+' -> '+ (dataviz.got_third/students.length)*100+'%</td><td>'+dataviz.got_one+' -> '+ (dataviz.got_one/students.length)*100+'%</td><td>'+dataviz.got_none+' -> '+ (dataviz.got_none/students.length)*100+'%</td><td>'+dataviz.got_peers+' -> '+ (dataviz.got_peers/students.length)*100 +'%</td></tr>');


	}
	
	$('#show_hide_students').click(function(){
		if($('table.students').hasClass('off')){
			$('table.students').removeClass('off');
			$('#show_hide_students').html('-');
		} else {
			$('table.students').addClass('off');
			$('#show_hide_students').html('+');
		}
	});
	
	var iteration = 0;

		
	  }
	});	
});

// Load the Visualization API and the piechart package.
  google.load('visualization', '1.0', {'packages':['corechart']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.setOnLoadCallback(drawChart);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
function drawChart(){
	var i = setInterval(function(){
		if(ajaxed){
			drawChart1();
			drawChart2();
			drawChart3();
		}
	}, 100);
}
  function drawChart1() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Choice');
    data.addColumn('number', 'Students');
    data.addRows([
      ['1st Choice', got_first],
      ['2nd Choice', got_second],
      ['3rd Choice', got_third],
      ['No choice', got_none],
    ]);

    // Set chart options
    var options = {'title':'Students by choice',
                   'width':400,
                   'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div1'));
    chart.draw(data, options);
  }

  function drawChart2() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Choice');
    data.addColumn('number', 'Students');
    data.addRows([
      ['Got one of their choices', got_one],
      ['Didn\'t get any of their choices', got_none],
    ]);

    // Set chart options
    var options = {'title':'Got One vs. Got None',
                   'width':400,
                   'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div2'));
    chart.draw(data, options);
  }

  function drawChart3() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Choice');
    data.addColumn('number', 'Students');
    data.addRows([
      ['In a section with a peer', got_peers],
      ['In a section with no peers', (80-got_peers)]
    ]);

    // Set chart options
    var options = {'title':'Students by peers',
                   'width':400,
                   'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div3'));
    chart.draw(data, options);
  }