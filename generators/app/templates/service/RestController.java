package <%=packageName%>;

import com.codahale.metrics.annotation.Timed;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

<% imports && imports.forEach(function (importClassName, i) { %>import <%=modelPackageName %>.<%=importClassName %>;
<% }) %>

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("<%=basePath%>")
public class <%=classname%> {
    private static final Logger logger = LoggerFactory.getLogger(<%=classname%>.class);

<%routes.forEach(function (route, i)
  {%>

    <%route.operations.forEach(function (operation, i)
    {%>/**
     * summary: <%=operation.summary%>
     * description: <%-operation.description%>
     * consumes: <%- operation.consumesString%>
     * produces: <%- operation.producesString%>
     * operationId: <%=operation.name%>
     * returnType: <%-operation.returnType%>
     */

<%if (operation.returnType !== 'void') { %>    @ResponseBody<% } %>
    @RequestMapping(method = RequestMethod.<%=operation.method%>, path = "<%=operation.path%>"<%if (operation.produces) { %>, produces = {"<%- operation.produces.join('", "')%>"}<% } %><%if (operation.consumes) { %>, consumes = {"<%- operation.consumes.join('", "')%>"}<% } %>)
    @ResponseStatus(<%-operation.successStatus%>)
    @Timed(absolute = true)
    @ApiOperation(value = "<%=operation.name%>", nickname = "<%=operation.name%>"<%if (operation.producesString) { %>, produces = "<%-operation.producesString%>"<% } %><%if (operation.consumesString) { %>, consumes = "<%-operation.consumesString%>"<% } %>)
    @ApiResponses(value = {
<% operation.responses && Object.keys(operation.responses).forEach(function (code) { var response=operation.responses[code]; %>        @ApiResponse(code = <%=response.httpStatus%>, message = "<%=response.message%>"<%if (response.respSwaggerResponse) { %>, response = <%=response.respSwaggerResponse%>.class<% } %><%if (response.responseContainer) { %>, responseContainer = "<%=response.responseContainer%>"<% } %>)<%if (!response.isLastResponse) {%>,
<%}%><%})%>
    })
    public <%-operation.returnType%> <%=operation.name%>(
    <%operation.parameters && operation.parameters.forEach(function (param, i){%><%if (param.in === 'header') { %>    @RequestHeader("<%=param.name%>") <%-param.paramType%> <%=param.name%><% } %><%if (param.in === 'path') { %>    @PathVariable("<%=param.name%>") <%-param.paramType%> <%=param.name%><% } %><%if (param.in === 'body') { %>    @RequestBody <%-param.paramType%> <%=param.name%><% } %><%if (param.in === 'query' || param.in === 'formData') { %>    @RequestParam("<%=param.name%>") <%-param.paramType%> <%=param.name%><% } %><%if (i < operation.parameters.length - 1) {%>,
    <%}%><%})%>
    ) {
      <%if (operation.returnType !== 'void') { %>return <% if (operation.responseContainer) { %>Collections.singletonList(<% } %><% if (['Integer', 'String', 'Long', 'Boolean', 'Float', 'Decimal'].indexOf(operation.responseClass) === -1) { %><%=operation.responseClass%>.<%=operation.responseClass%>Builder.a<%=operation.responseClass%>().build()<% } else { %><%=operation.responseClass%>.valueOf("1")<% } %><% if (operation.responseContainer) { %>)<% } %>;<% } %>
    }
  <%})%>
<%});%>
}
