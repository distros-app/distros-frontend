import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgIf } from '@angular/common';
//import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
//import * as fs from 'fs';
import { Papa } from 'ngx-papaparse';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, NgIf],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  isLoading: boolean = false;
  seenUsernames = new Set();
  seenNames = new Set();
  parsedData: any[] = [];
  csvColumns: Array<string> = ['Name', 'Username', 'Followers', 'Category'];
  selectedFile!: File;
  payload: any = {
    data: []
  };
  constructor(private _AdminService: AdminService, private papa: Papa) {

  }

  ngOnInit() {

  }

  onUpdateInfluencersInDB() {
    this.isLoading = true;
    this._AdminService.updateInfluencersInDB(this.payload).subscribe((response: any) => {
      if(response) {
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  onAddInfluencersToDB() {
    this.isLoading = true;
    this._AdminService.addInfluencersToDB(this.payload).subscribe((response: any) => {
      if(response) {
        this.isLoading = false;
      } else {
        this.isLoading = false;
      }
    });
  }

  // Triggered when the user selects a file
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Get the selected file
    if (this.selectedFile) {
      const reader = new FileReader(); // Create a FileReader to read file contents
      reader.onload = () => {
        const csvContent = reader.result as string; // Read file content as a string
        this.parseCSV(csvContent); // Call parseCSV with the CSV content
      };
      reader.readAsText(this.selectedFile); // Read the file as text
    }
  }

    
  async extractUsernames(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
    const jsonParsed: any = await this.readFile(this.selectedFile);
    let excelForm: any = [];
    let i = 0;
    for(let row of jsonParsed) {
      const form = {
        username: this.extractUsername(row['IG']),
      };
      
      if(form.username) excelForm.push(form);
      i++;
    }
    /*
    let headers = this.csvColumns;
            new Angular5Csv(excelForm, 'Influencers', {
              showLabels: true,
              headers,
              fieldSeparator: ',',
              quoteStrings: '"',
              decimalseparator: '.'
            });
            */
}

extractName(bio: any) {
  // Regular expression to capture possible full names, considering multiple capitalized words.
  const regex = /([A-Z][a-z]+(?: [A-Z][a-z]+)+)/;

  const match = bio?.match(regex);
  
  if (match) {
      const name = match[1];

      // Common non-name words to exclude (can add more if needed)
      const commonWords = ["coach", "dating", "reset", "relationship", "your", "men", "women", "influencer", "entrepreneur", "lifestyle"];

      // Check if the name is not part of the common words
      if (!commonWords.includes(name.toLowerCase()) && /^[A-Za-z]+(?: [A-Za-z]+)+$/.test(name)) {
          if (!this.seenNames.has(name)) {
              this.seenNames.add(name);
              return name; // Return valid name
          }
      }
  }

  return null; // If no valid name is found
}

extractUsername(url: any) {
  const regex = /https:\/\/www\.instagram\.com\/([^\/]+)/;
  const match = url?.match(regex);
  if (match) {
    if(!this.seenUsernames.has(match[1])) {
      this.seenUsernames.add(match[1]);
      return match[1]; // This is the username part
    }
    return null;
  } else {
      return null; // Return null if the URL doesn't match
  }
}

  async testImportFile() {
    if(this.selectedFile) {
      this.isLoading = true;
      this._AdminService.testImportFile(this.parsedData).subscribe((response: any) => {
        if(response) {
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      });
    }
  }

  readFile(file: any) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result;
        const json = this.csvToJSON(text);
        return resolve(json);
      };
      reader.readAsText(file);
    });
  }

    // Parses the CSV content using PapaParse
    parseCSV(csvData: string) {
      this.papa.parse(csvData, {
        header: true, // Use the first row as headers
        skipEmptyLines: true, // Skip empty lines
        complete: async(result: any) => {
          this.parsedData = result.data; // Save the parsed data
          console.log('Parsed Data:', this.parsedData); // Log the data for debugging
          await this.testImportFile();
        },
        error: (error: any) => {
          console.error('Error parsing CSV:', error); // Log errors if any
        },
      });
    }

  csvToJSON(csv: any) {
    let lines = csv.split('\n');
    lines = lines.map((line: any) => line.replace(/(\r\n|\n|\r)/gm, ''));
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i];

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentLine[j];
      }
      result.push(obj);
    }

    return JSON.parse(JSON.stringify(result));
  }

  uploadImportData() {

  }
}
