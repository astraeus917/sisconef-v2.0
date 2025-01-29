<?php

namespace App\Http\Controllers;

use App\Models\Military;
use App\Models\Presence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;


class MilitaryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Military::select('militaries.id as id', DB::raw("CONCAT(ranks.name, ' ', militaries.name) AS military"), 'militaries.name as name', 'ranks.name as rankName', 'subunit_id', 'rank_id')
            ->where('status', 'ativa')
            ->join('subunits', 'subunits.id', '=', 'militaries.subunit_id')
            ->join('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->orderBy('seniority', 'ASC')
            ->orderBy('number', 'ASC')
            ->get();
    }


    public function getMilitaries(Request $request)
    {
        if ($request->subunit_id == 0) {
            return Military::select('militaries.id as id', DB::raw("CONCAT(ranks.name, ' ', militaries.name, ' (', COALESCE(workplaces.workplace, '.'), ')') AS military"), 'militaries.name as name', 'ranks.name as rankName', 'subunit_id', 'rank_id')
            ->where('status', 'ativa')
            ->join('subunits', 'subunits.id', '=', 'militaries.subunit_id')
            ->join('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->leftJoin('workplaces', 'workplaces.id', '=', 'militaries.workplace_id')
            ->orderBy('seniority', 'ASC')
            ->orderBy('number', 'ASC')
            ->get();
        }

        return Military::select('militaries.id as id', DB::raw("CONCAT(ranks.name, ' ', militaries.name, ' (', COALESCE(workplaces.workplace, '.'), ')') AS military"), 'militaries.name as name', 'ranks.name as rankName', 'subunit_id', 'rank_id')
            ->where('status', 'ativa')
            ->where('subunit_id', $request->subunit_id)
            ->join('subunits', 'subunits.id', '=', 'militaries.subunit_id')
            ->join('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->leftJoin('workplaces', 'workplaces.id', '=', 'militaries.workplace_id')
            ->orderBy('seniority', 'ASC')
            ->orderBy('number', 'ASC')
            ->get();        
    }


    public function militariesNotInPresence(Request $request) // Busca no banco de dados os militares sem presença na data atual.
    {
        return Military::select('militaries.id as id', DB::raw("CONCAT(ranks.name, ' ', IF(militaries.number IS NULL, \"\", militaries.number),' ', militaries.name, ' (', COALESCE(workplaces.workplace, '.'), ')') AS military"), 'militaries.name as name', 'ranks.name as rankName', 'subunit_id', 'rank_id')
            ->whereNotIn('militaries.id', Presence::select('military_id')->where('date', date('Y-m-d'))->get()->toArray())
            ->where('subunit_id', $request->subunit_id)
            ->where('status', 'ativa')
            ->join('subunits', 'subunits.id', '=', 'militaries.subunit_id')
            ->join('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->leftJoin('workplaces', 'workplaces.id', '=', 'militaries.workplace_id')
            ->orderBy('seniority', 'ASC')
            ->orderBy('number', 'ASC')
            ->get();
    }


    public function militariesInPresenceMade(Request $request) // Busca os militares que tem presença conforme a data atual, e os militares de ferias.
    {
        return Presence::select('militaries.id as id', DB::raw("CONCAT(ranks.name, ' ', IF(militaries.number IS NULL, \"\", militaries.number),' ', militaries.name, ' (', COALESCE(workplaces.workplace, '.'), ')') AS military"), 'militaries.name as name', 'ranks.name as rankName', 'subunit_id', 'rank_id', 'destination', 'presences.id as presenceId')
            ->where(function($query) use ($request) {
                $query->where('date', date('Y-m-d'))
                    ->where('subunit_id', $request->subunit_id)
                    ->where('status', 'ativa')
                    ->orWhere(function($query) use ($request) {
                        $query->where('destination', 'NADA') // Serve para puxar do DB todos com FÉRIAS no periodo atual.
                            ->where('subunit_id', $request->subunit_id)
                            ->where('status', 'ativa');
                    });
            })
            ->join('militaries', 'presences.military_id', '=', 'militaries.id')
            ->join('subunits', 'subunits.id', '=', 'militaries.subunit_id')
            ->join('destinations', 'presences.destination_id', '=', 'destinations.id')
            ->join('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->leftJoin('workplaces', 'workplaces.id', '=', 'militaries.workplace_id')
            ->orderBy('seniority', 'ASC')
            ->orderBy('number', 'ASC')
            ->get();
    }


    // Search the database for all military personnel with defined presence to be displayed in the mapping.component.
    public function totalMilitariesInPresenceMade(Request $request) // Searches all military personnel according to the specified date to generate a report.
    {

        if($request->date == null){
            $date = date('Y-m-d');
        } else {
            $date = $request->date;
        }

        return Presence::select('militaries.id as id', DB::raw("CONCAT(ranks.name, ' ', militaries.name, ' (', COALESCE(workplaces.workplace, '.'), ')') AS military"),DB::raw("CONCAT(ranks.name, ' ', militaries.name) AS military_name"), 'militaries.name as name', 'militaries.number as number', 'ranks.name as rankName', 'subunit_id', 'subunits.name as subunitName', 'rank_id', 'destination', 'destination_id', 'workplace_id', 'workplace')
            ->where('date', $date)
            ->where('status', 'ativa')
            ->join('militaries', 'presences.military_id', '=', 'militaries.id')
            ->join('subunits', 'subunits.id', '=', 'militaries.subunit_id')
            ->join('destinations', 'presences.destination_id', '=', 'destinations.id')
            ->join('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->leftJoin('workplaces', 'workplaces.id', '=', 'militaries.workplace_id')
            ->orderBy('seniority', 'ASC')
            ->orderBy('number', 'ASC')
            ->get();
    }


    // Search the database for all military personnel with defined presence with the selected data to be specified in the mapping.component.
    public function totalMilitariesInPresenceMadeDate(Request $request) // Searches all military personnel according to the specified date to generate a report.
    {
        if($request == null){
            $date = date('Y-m-d');
        } else {
            $date = $request->date;
        }
            
        return Presence::select('militaries.id as id', DB::raw("CONCAT(ranks.name, ' ', militaries.name, ' (', COALESCE(workplaces.workplace, '.'), ')') AS military"), 'militaries.name as name', 'militaries.number as number', 'ranks.name as rankName', 'subunit_id', 'subunits.name as subunitName', 'rank_id', 'destination', 'destination_id', 'workplace_id', 'workplace')
            ->where('date', $date)
            ->where('status', 'ativa')
            ->join('militaries', 'presences.military_id', '=', 'militaries.id')
            ->join('subunits', 'subunits.id', '=', 'militaries.subunit_id')
            ->join('destinations', 'presences.destination_id', '=', 'destinations.id')
            ->join('ranks', 'ranks.id', '=', 'militaries.rank_id')
            ->leftJoin('workplaces', 'workplaces.id', '=', 'militaries.workplace_id')
            ->orderBy('seniority', 'ASC')
            ->orderBy('number', 'ASC')
            ->get();
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required',
    //         'rank_id' => 'required',
    //         'subunit_id' => 'required',
    //         'workplace_id' => 'required'
    //     ]);

    //     try {
    //         Military::create($request->post());

    //         return response()->json([
    //             'message' => 'Militar cadastrado com sucesso!',
    //         ]);
    //     } catch (\Exception $e) {
    //         \Log::error($e->getMessage());
    //         return response()->json(
    //             [
    //                 'message' => 'Ocorreu um erro ao cadastrar o Militar!',
    //             ],
    //             500,
    //         );
    //     }
    // }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'rank_id' => 'required',
            'subunit_id' => 'required',
            'workplace_id' => 'required'
        ]);
    
        try {
            $existingMilitary = Military::where('name', $request->name)
                                        ->where('rank_id', $request->rank_id)
                                        ->first();
    
            if ($existingMilitary) {
                return response()->json([
                    'message' => 'O militar já está registrado!',
                    'name' => $existingMilitary->name,
                    'rank' => $existingMilitary->rank->name,
                    'subunit' => $existingMilitary->subunit->name,
                ]);
            }
    
            Military::create($request->post());
    
            return response()->json([
                'message' => 'Militar cadastrado com sucesso!',
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json(
                [
                    'message' => 'Ocorreu um erro ao cadastrar o Militar!',
                ],
                500,
            );
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Military $military)
    {
        // return response()->json([
        //     'military'=>$military
        // ]);

        return response()->json([
            'military' => [
                'id' => $military->id,
                'name' => $military->name,
                'number' => $military->number,
                'subunit_id' => $military->subunit_id,
                'rank_id' => $military->rank_id,
                'rank_name' => $military->rank->name,
                'workplace_id' => $military->workplace_id
            ]
        ]);
    }


    public function edit(Military $military)
    {
        return response()->json([
            'military'=>$military
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Military $military)
    {
        $request->validate([
            'name'=>'required',
            'subunit_id'=>'required',
            'rank_id'=>'required',
            'workplace_id' => 'nullable|integer',
        ]);

        try{

            $military->fill($request->post())->update();

            return response()->json([
                'message' => 'Militar atualizado com sucesso!'
            ]);

        }catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Algo deu errado ao atualizar as informações do militar!'
            ],500);
        }
    }


    public function changeSubunit(Request $request, Military $military)
    {
        $validator = \Validator::make($request->all(), [
            'subunit_id' => 'required|exists:subunits,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $military->subunit_id = $request->input('subunit_id');
            $military->save();

            return response()->json([
                'message' => 'Subunidade alterada com sucesso!',
            ]);
        } catch (\Exception $e) {
            \Log::error($e->getMessage());
            return response()->json([
                'message' => 'Erro ao alterar a subunidade do militar!',
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Military $military)
    {
        try{

            $military->status = 'inativo';
            $military->save();

            return response()->json([
                'message'=>'Militar excluído com sucesso!'
            ]);

        }catch(\Exception $e){
            \Log::error($e->getMessage());
            return response()->json([
                'message'=>'Algo deu errado ao excluir o militar!'
            ],500);
        }
    }
}

