<div class="glossary">
	<section>
		<p><em>Remote Procedure Calls</em> are deepstreamHub’s request-response mechanism. Clients and backend processes can register as “providers” for a given RPC, identified by a unique name. Other endpoints can request said RPC.</p>
		<p>deepstreamHub will route requests to the right provider, load-balance between multiple providers for the same RPC, and handle data-serialisation and transport.</p>
	</section>
</div>
