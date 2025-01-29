<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    public function index()
    {
        return Destination::all();
    }
    public function store(Request $request)
    {
        $request->validate([
            'destination' => 'required',
        ]);

        try {
            Destination::create($request->post());

            return response()->json([
                'message' => 'Novo destino inserido no sistema!',
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(
                [
                    'message' => 'Erro ao cadastrar o destino!',
                ],
                500,
            );
        }
    }
}
