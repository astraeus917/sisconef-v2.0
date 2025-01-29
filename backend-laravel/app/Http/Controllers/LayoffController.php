<?php

namespace App\Http\Controllers;

use App\Models\Military;
use App\Models\Layoff;
use App\Models\Presence;
use App\Models\Rank;
use App\Models\Destination;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;

class LayoffController extends Controller
{
    // Searches for and returns military personnel who do not have defined vacations.
    public function militariesNotInLayoff(Request $request)
    {
        return Military::select(
                'militaries.id as id',
                DB::raw("CONCAT(ranks.name, ' ', IF(militaries.number IS NULL, '', militaries.number), ' ', militaries.name, ' (', COALESCE(workplaces.workplace, '.'), ')') AS military"),
                'militaries.name as name',
                'ranks.name as rankName',
                'subunit_id',
                'rank_id'
            )
            ->where('subunit_id', $request->subunit_id)
            ->where('status', 'ativa')
            ->join('subunits', 'subunits.id', '=', 'militaries.subunit_id')
            ->join('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->leftJoin('workplaces', 'workplaces.id', '=', 'militaries.workplace_id')
            ->orderBy('seniority', 'ASC')
            ->orderBy('number', 'ASC')
            ->get();
    }

    // Searches for and returns military personnel with registered layoffs.
    public function militariesInLayoff(Request $request)
    {
        return Layoff::select(
                'layoffs.id as layoff_id',
                'militaries.id as id',
                DB::raw("CONCAT(ranks.name, ' ', IF(militaries.number IS NULL, '', militaries.number), ' ', militaries.name, ' (', COALESCE(workplaces.workplace, '.'), ')') AS military"),
                'destinations.destination as destination',
                DB::raw("DATE_FORMAT(layoffs.date_start, '%d-%m-%Y') as date_start"),
                DB::raw("DATE_FORMAT(layoffs.date_end, '%d-%m-%Y') as date_end")
            )
            ->where('militaries.status', 'ativa')
            ->where('subunit_id', $request->subunit_id)
            ->join('militaries', 'militaries.id', '=', 'layoffs.military_id')
            ->join('destinations', 'destinations.id', '=', 'layoffs.destination_id')
            ->leftJoin('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->leftJoin('workplaces', 'workplaces.id', '=', 'militaries.workplace_id')
            ->where('layoffs.date_end', '>', now())
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'date_start' => 'required',
            'date_end' => 'required',
            'military_id' => 'required',
            'destination_id' => 'required'
        ]);

        try {
            Layoff::create($request->post());

            return response()->json([
                'message' => 'Férias/Dispensa cadastrada com sucesso!',
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(
                [
                    'message' => 'Ocorreu um erro ao cadastrar a Férias/Dispensa!',
                ],
                500,
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Search for layoff by your ID.
        $layoff = Layoff::find($id);
        
        if (!$layoff) {
            return response()->json([
                'message' => 'Férias/Dispensa não encontrada!'
            ], 404);
        }
    
        // Search for military personnel related to Layoff.
        $military = Military::find($layoff->military_id);
    
        if (!$military) {
            return response()->json([
                'message' => 'Militar não encontrado!'
            ], 404);
        }
    
        // Search for military rank.
        $rank = Rank::find($military->rank_id);
    
        if (!$rank) {
            return response()->json([
                'message' => 'Graduação não encontrada!'
            ], 404);
        }
    
        // Search for military destiny.
        $destination = Destination::find($layoff->destination_id);
    
        if (!$destination) {
            return response()->json([
                'message' => 'Destino não encontrado!'
            ], 404);
        }
    
        return response()->json([
            'rank_name' => $rank->name,
            'military_name' => $military->name,
            'layoff_id' => $layoff->id,
            'date_start' => $layoff->date_start,
            'date_end' => $layoff->date_end,
            'destination_id' => $destination->id
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Layoff $layoff)
    {
        $request->validate([
            'date_start' => 'required|date',
            'date_end' => 'required|date|after_or_equal:date_start',
            'destination_id' => 'required'
        ]);

        try {
            $layoff->fill($request->all());
            $layoff->save();

            return response()->json([
                'message' => 'Férias/Dispensa atualizada com sucesso!'
            ]);

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Algo deu errado ao atualizar as informações do Férias/Dispensa!'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($layoff_id)
    {
        try {
            // Find Layoff for ID.
            $layoff = Layoff::findOrFail($layoff_id);
            
            // Delete the register.
            $layoff->delete();
    
            return response()->json([
                'message' => 'Férias/Dispensa excluída com sucesso!'
            ]);

        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Algo deu errado ao excluir a Férias/Dispensa!'
            ], 500);
        }
    }
}