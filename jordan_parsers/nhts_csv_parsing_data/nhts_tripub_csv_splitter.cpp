// Author: Jordan Randleman -- nhts_tripub_csv_splitter.cpp
// Use: designed to split "trippub.csv" from "https://nhts.ornl.gov/" 
//      into a set of files that are then parsed by "nhts_csv_parser.js"

// COMPILE:
//   $ clang++ -std=c++17 -O3 -o splitter nhts_tripub_csv_splitter.cpp
//
// RUN:
//   $ ./splitter

#include <cstdlib>
#include <cstdio>
#include <string>     // because f*ck malloc
#include <filesystem> // platform-independant directory creation

/******************************************************************************
* CONSTANTS
******************************************************************************/

#define GENERATED_FILEPATH "NHTS_SPLIT_CSV_FILES/trippub"

#define CSV_FILEPATH "NHTS_CSV_FILES/trippub.csv"

#define LINES_PER_GENERATED_FILE 100000

#define TOTAL_LINES_IN_TRIPUB 923572

#define TOTAL_GENERATED_FILES (TOTAL_LINES_IN_TRIPUB/LINES_PER_GENERATED_FILE)+1

/******************************************************************************
* FILE WRITING HELPER FUNCTION
******************************************************************************/

void generate_file(FILE* read) {
  static int filenumber = 0;
  std::string contents;
  char buffer[1000];
  int j = 0;
  while(j < LINES_PER_GENERATED_FILE && fgets(buffer, 1000, read))
    contents += buffer, ++j;
  std::string filename = GENERATED_FILEPATH + std::to_string(filenumber++) + ".csv";
  FILE* write = fopen(filename.c_str(), "w");
  fputs(contents.c_str(), write);
  fclose(write);
  printf("]=> Generated File: %s\n", filename.c_str());
}

/******************************************************************************
* MAIN EXECUTION
******************************************************************************/

int main() {
  std::filesystem::create_directory("NHTS_SPLIT_CSV_FILES");
  FILE* read = fopen(CSV_FILEPATH, "r");
  for(int i = 0; i < TOTAL_GENERATED_FILES; ++i) generate_file(read);
  fclose(read);
  return 0;
}
