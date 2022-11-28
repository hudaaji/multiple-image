<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ImagesController extends Controller
{
    public function create(Request $request)
    {
        try {
            $file = $request->file('ximages');
            $success_status = false;

            if ($file) {
                $filename = $file->getClientOriginalName();
                $storagePath  = ''.$filename;

                if (Storage::disk('path_images')->put($storagePath,file_get_contents($file))) {
                    $success_status = true;
                }
            }

            if ($success_status) {
                $check = DB::table('images')->where('id', $request->xid)->first();
                if ($check) {
                    DB::table('images')->where('id', $request->xid)->update(
                        [
                            'title' => $request->xtitle,
                            'images' => $filename
                        ]
                    );
                } else {
                    DB::table('images')->insert(
                        [
                            'title' => $request->xtitle,
                            'images' => $filename
                        ]
                    );
                }
            }
            return response()->json(
                [
                    'success' => true,
                    'message' => 'Data Berhasil Disimpan'
                ],
                200
            );
        } catch (Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage()
                ],
                401
            );
        }
    }

    public function getData()
    {
        try {
            $data = DB::table('images')->get();

            return response()->json(
                [
                    'success' => true,
                    'data' => $data
                ],
                200
            );
        } catch (Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => $e->getMessage()
                ],
                401
            );
        }
    }
}
