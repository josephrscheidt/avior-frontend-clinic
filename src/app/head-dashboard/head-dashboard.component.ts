import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { HeadDashboardService } from './service/head-dashboard.service';
import { CommonService } from './../common/common.service';
import { PatientService } from './../patient/service/patient.service';
import { MessageService } from './../common/message.service';
import * as Chart from 'chart.js'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from './../template/service/template.service';

@Component({
  selector: 'app-head-dashboard',
  templateUrl: './head-dashboard.component.html',
  styleUrls: ['./head-dashboard.component.css']
})
export class HeadDashboardComponent implements OnInit {
  p: number = 1;
  
  role : number ;

	therapist_id : any ;

	clinic_id: any;

  colors_options = ['rgb(227, 242, 253)', 'rgb(187, 222, 251)', 'rgb(144, 202, 249)', 'rgb(100, 181, 246)', 'rgb(66, 165, 245)', 'rgb(33, 150, 243)', 'rgb(30, 136, 229)', 'rgb(25, 118, 210)', 'rgb(21, 101, 192)', 'rgb(13, 71, 161)', 'rgb(130, 177, 255)', 'rgb(68, 138, 255)', 'rgb(41, 121, 255)', 'rgb(41, 98, 255)'];
  
  colors_graph: any = [];

  active_count:number;

  patients_created_count:number;

  goals_count:number;
 
  active_patients_graph: any = [];

  patients_created_graph: any = [];

  goals_created_graph: any = [];

  therapists_graph: any = [];

  clinicTherapists:any = [];

	constructor(private elem: ElementRef, public message: MessageService, public headDashboardService : HeadDashboardService, public common: CommonService, public patientService: PatientService, private route: ActivatedRoute, private modalService: BsModalService, public templateService: TemplateService, public router: Router) { }
	
  ngOnInit() {

    this.common.addLoaderRow(5);

		this.role = parseInt(localStorage.getItem('role'));

		this.therapist_id = localStorage.getItem('id');

    this.clinic_id = parseInt(localStorage.getItem('clinic'));

    this.getClinicData(this.clinic_id);

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

  }
    
    getClinicData(clinicId:number){
      this.patientService.getTherapists(clinicId).subscribe(res => {
        // Pull therapists
        var therapistsData;
        if(!res){
          this.patientService.therapists.subscribe(res=>{
            therapistsData = res;
          })
        }else{
          therapistsData = res;
        }
        // create therapist array with relevant data
        for (let therapist of therapistsData){
          var inde = {name: therapist.name, id: therapist.id, active_patients: 0, patients_created: 0, goals_created: 0};
          this.clinicTherapists.push(inde);
        }
        // Pull goals data and process
        this.headDashboardService.getDataByClinicID(clinicId).subscribe(res=>{
          var clinicData;
          if (!res){
            this.headDashboardService.clinicData.subscribe(res=>{
              clinicData = res;
            })
          }else{
            clinicData = res;
          }

          var goalsData = [];

          for (let goal of clinicData){
            goalsData.push(JSON.parse(goal.data));
          }
          this.goals_count = goalsData.length;

          for (let goal of goalsData){
            for (let therapist of this.clinicTherapists){
              // if (goal.therapist_id==therapist.id){therapist.goals_created+=1}
              therapist.goals_created+=1
            }
          }

          this.patientService.getAllPatients(this.clinic_id).subscribe(res => { 
            // Pull all patients
            var patientData;
            if(!res){
              this.patientService.allPatients.subscribe(res=>{
                patientData = res;
              })
            }else{
              patientData = res
            }
            this.patients_created_count = patientData.length;
            // filter for active patients
            var activePatients = patientData.filter(patient => patient.is_active==1);
            this.active_count = activePatients.length;
            // process active patient data
            for (let patient of activePatients){
              for (let therapist of this.clinicTherapists){
                if(patient.tbl_treatment.pt_id == therapist.id){therapist.active_patients += 1}
              }
            }
            // process all patient data
            for (let patient of patientData){
              for (let therapist of this.clinicTherapists){
                if(patient.tbl_treatment.pt_id == therapist.id){therapist.patients_created += 1}
              }
            }
            // Create Arrays for graphs
            for (var k = 0; k < this.clinicTherapists.length; k++) {
              this.active_patients_graph[k] = this.clinicTherapists[k].active_patients;
              this.patients_created_graph[k] = this.clinicTherapists[k].patients_created;
              this.goals_created_graph[k] = this.clinicTherapists[k].goals_created;
              this.therapists_graph[k] = this.clinicTherapists[k].name;
              this.colors_graph[k] = this.colors_options[k];
            }

            this.drawPieChart('activePatientsChart', this.active_patients_graph, this.therapists_graph);
      
            this.drawPieChart('patientsCreatedChart', this.patients_created_graph, this.therapists_graph);
        
            this.drawPieChart('goalsCreatedChart', this.goals_created_graph, this.therapists_graph);

            this.common.hideLoaderRow(); 
           
        });

        })

      });

    }


	drawPieChart(ele, data, labels){

		let canvas :any = document.getElementById(ele) as HTMLElement;

		new Chart(canvas, {
			type: 'pie',
			data: {
				datasets: [{
          data: data,
          backgroundColor: this.colors_graph
					// backgroundColor: [
					// '#C9E2F6',
					// '#90C4EE',
					// '#1E93F0'
					// ]
				}],
				labels: labels
			},
			options: {
				responsive: true,
				legend:{
          position: 'right',
          // labels: {
          //   fontSize: '10'
          // }
				}
			}
		});
  }
  
  // drawLineChart(ele, data, labels){

	// 	let canvas :any = document.getElementById(ele) as HTMLElement;

	// 	new Chart(canvas, {
	// 		type: 'line',
	// 		data: {
	// 			datasets: [{
  //         label: 'Patients',
  //         yAxisID: 'A',
  //         borderColor: '#007DB2',
  //         borderWidth: 2,
  //         fill: false,
  //         pointBackgroundColor: "#007DB2",
  //         data: data
	// 			}],
	// 			labels: labels
	// 		},
	// 		options: {
  //       plugins: {
  //         datalabels: {
  //           color: 'white',
  //           display: function(context) {
  //             return context.dataset.data[context.dataIndex] != "0";
  //           },
  //           font: {
  //             weight: 'bold'
  //           },
  //           formatter: Math.round
  //         }
  //       },
  //       legend: {
  //         display: false,
  //         labels: {
  //           fontColor: '#007DB2',
  //         }
  //       },
  //       scales: {
  //         xAxes: [{
  //           gridLines: {
  //             color: "transparent",
  //             display: true,
  //             drawBorder: false,
  //           },
  //           ticks: {
  //             fontColor: "#007DB2", // this here
  //             fontSize: '16'
  //           },
  //         }],
  //         yAxes: [{
  //           gridLines: {
  //             color: "#D3D3D3"
  //           },
  //           id: 'A',
  //           type: 'linear',
  //           position: 'left',
  //           scaleLabel: {
  //             display: false,
  //             labelString: "Number of Patients",
  //             fontColor: "#007DB2"
  //           },
  //           ticks: {
  //             fontColor: "#007DB2",
  //             fontSize: '16',
  //             max: 75,
  //             min: 0,
  //             stepSize: 15
  //           }
  //         }
  //       ]
  //       },
	// 			responsive: true,
	// 			}
	// 	});
	// }

// painChart(){

//     let canvas :any = document.getElementById('trialChart') as HTMLElement;

//     new Chart(canvas, {

//       type: 'line',
//       data: {
//         labels: ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7"],
//         datasets: [{
//           label: 'Pain',
//           yAxisID: 'A',
//           borderColor: '#007DB2',
//           borderWidth: 2,
//           fill: false,
//           pointBackgroundColor: "#007DB2",
//           data: [0, 8, 1, 4],
//         }, {
//           label: 'Function',
//           yAxisID: 'B',
//           borderColor: 'rgb(255,255,255)',
//           data: [20,50,85,79],
//           spanGaps: true,
//           fill: false
//         }]
//       },
//       options: {
//         plugins: {
//           datalabels: {
//             color: 'white',
//             display: function(context) {
//               return context.dataset.data[context.dataIndex] != "0";
//             },
//             font: {
//               weight: 'bold'
//             },
//             formatter: Math.round
//           }
//         },
//         legend: {
//           display: false,
//           labels: {
//             fontColor: '#007DB2',
//           }
//         },
//         scales: {
//           xAxes: [{
//             gridLines: {
//               color: "transparent",
//               display: true,
//               drawBorder: false,
//             },
//             ticks: {
//               fontColor: "#007DB2", // this here
//               fontSize: '16'
//             },
//           }],
//           yAxes: [{
//             gridLines: {
//               color: "rgba(255, 255, 255, 0.5)"
//             },
//             id: 'A',
//             type: 'linear',
//             position: 'left',
//             scaleLabel: {
//               display: false,
//               labelString: "Number of Patients",
//               fontColor: "#007DB2"
//             },
//             ticks: {
//               fontColor: "#007DB2",
//               fontSize: '16',
//               max: 10,
//               min: 0,
//               stepSize: 5
//             }
//           }, {
//             gridLines: {
//               color: "rgba(255, 255, 255, 0.5)"
//             },
//             id: 'B',
//             type: 'linear',
//             position: 'right',
//             scaleLabel: {
//               display: true,
//               labelString: "Function",
//               fontColor: '#ffffff'
//             },
//             ticks: {
//               beginAtZero: false,
//               fontColor: "#CCC",
//               max: 100,
//               min: 0,
//               stepSize: 50
//             }
//           }]
//         }
//       }
//     });}

// goalsChart(){

//     let canvas :any = document.getElementById('goalsChart') as HTMLElement;

//     new Chart(canvas, {

//       type: 'line',
//       data: {
//         labels: ["Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7"],
//         datasets: [{
//           label: 'Pain',
//           yAxisID: 'A',
//           borderColor: '#007DB2',
//           borderWidth: 2,
//           fill: false,
//           pointBackgroundColor: "#007DB2",
//           data: [0, 8, 1, 4],
//         }, {
//           label: 'Function',
//           yAxisID: 'B',
//           borderColor: 'rgb(255,255,255)',
//           data: [20,50,85,79],
//           spanGaps: true,
//           fill: false
//         }]
//       },
//       options: {
//         plugins: {
//           datalabels: {
//             color: 'white',
//             display: function(context) {
//               return context.dataset.data[context.dataIndex] != "0";
//             },
//             font: {
//               weight: 'bold'
//             },
//             formatter: Math.round
//           }
//         },
//         legend: {
//           display: false,
//           labels: {
//             fontColor: '#007DB2'
//           }
//         },
//         scales: {
//           xAxes: [{
//             gridLines: {
//               color: "transparent",
//               display: true,
//               drawBorder: false,
//             },
//             ticks: {
//               fontColor: "#007DB2" // this here
//             },
//           }],
//           yAxes: [{
//             gridLines: {
//               color: "rgba(255, 255, 255, 0.5)"
//             },
//             id: 'A',
//             type: 'linear',
//             position: 'left',
//             scaleLabel: {
//               display: false,
//               labelString: "Number of Patients",
//               fontColor: "#007DB2"
//             },
//             ticks: {
//               fontColor: "#007DB2",
//               max: 10,
//               min: 0,
//               stepSize: 5
//             }
//           }, {
//             gridLines: {
//               color: "rgba(255, 255, 255, 0.5)"
//             },
//             id: 'B',
//             type: 'linear',
//             position: 'right',
//             scaleLabel: {
//               display: true,
//               labelString: "Function",
//               fontColor: '#ffffff'
//             },
//             ticks: {
//               beginAtZero: false,
//               fontColor: "#CCC",
//               max: 100,
//               min: 0,
//               stepSize: 50
//             }
//           }]
//         }
//       }
//     });}
    // Chart.defaults.global.plugins.datalabels.display = function(ctx) { return ctx.value !== 0; }
//   }, (err) => {

//     this.common.responseType = 'danger';

//     this.common.response = err.error.message;

//     this.common.resetMessage();

//   });
// }

}
